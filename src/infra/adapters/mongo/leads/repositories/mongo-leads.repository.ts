import { Id, mapToVoid, Nullable } from '@internal/common';
import { MongoTransactionContextStorage } from '@internal/mongo';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { map, mergeMap, Observable, of } from 'rxjs';

import { InjectionConstant } from '@/app/common';
import { LeadGroup, LeadsRepository, Prospect } from '@/domain/leads';

import { LeadGroupDocument, ProspectDocument } from '../documents';
import { LeadGroupMapper, ProspectMapper } from '../mappers';

@Injectable()
export class MongoLeadsRepository implements LeadsRepository {
  constructor(
    @InjectModel(InjectionConstant.LEAD_MODEL)
    private readonly leadModel: Model<LeadGroupDocument>,
    private readonly leadMapper: LeadGroupMapper,
    @InjectModel(InjectionConstant.PROSPECT_MODEL)
    private readonly prospectModel: Model<ProspectDocument>,
    private readonly prospectMapper: ProspectMapper,
    private readonly context: MongoTransactionContextStorage,
  ) {}

  updateLead(group: LeadGroup): Observable<void> {
    return of(group).pipe(
      map((group) => this.leadMapper.reverseMap(group)),
      mergeMap((doc) => {
        const { _id, ...update } = doc;
        return this.leadModel.findOneAndUpdate({ _id }, update, {
          runValidators: true,
          new: false,
          session: this.context.getStore()?.session,
        });
      }),
      mapToVoid(),
    );
  }

  getProspectByLeadId(leadId: Id, prospectId: Id): Observable<Nullable<Prospect>> {
    return of({}).pipe(
      mergeMap(() =>
        this.prospectModel.findOne({
          _id: new Types.ObjectId(prospectId.toString()),
          lead_group_id: new Types.ObjectId(leadId.toString()),
        }),
      ),
      map((prospect) => prospect && this.prospectMapper.map(prospect)),
    );
  }

  getProspectById(prospectId: Id): Observable<Nullable<Prospect>> {
    return of({}).pipe(
      mergeMap(() =>
        this.prospectModel.findOne({
          _id: new Types.ObjectId(prospectId.toString()),
        }),
      ),
      map((prospect) => prospect && this.prospectMapper.map(prospect)),
    );
  }

  updateProspect(prospect: Prospect): Observable<void> {
    return of(prospect).pipe(
      map((prospect) => this.prospectMapper.reverseMap(prospect)),
      mergeMap((doc) => {
        const { _id, ...update } = doc;
        return this.prospectModel.findOneAndUpdate({ _id }, update, {
          runValidators: true,
          new: false,
          session: this.context.getStore()?.session,
        });
      }),
      mapToVoid(),
    );
  }

  saveProspects(prospects: Prospect[]): Observable<void> {
    return of(prospects).pipe(
      map((prospects) => this.prospectMapper.reverseMapFromList(prospects)),
      mergeMap((documents) =>
        this.prospectModel.insertMany(documents, {
          session: this.context.getStore()?.session,
        }),
      ),
      mapToVoid(),
    );
  }

  createLeadGroup(group: LeadGroup): Observable<void> {
    return of(group).pipe(
      map((group) => this.leadMapper.reverseMap(group)),
      mergeMap((document) =>
        this.leadModel.create([document], {
          session: this.context.getStore()?.session,
          runValidators: true,
          new: false,
        }),
      ),
      mapToVoid(),
    );
  }

  findById(id: Id): Observable<Nullable<LeadGroup>> {
    return of(id).pipe(
      map((id) => new Types.ObjectId(id.toString())),
      mergeMap((_id) => this.leadModel.findOne({ _id })),
      map((group) => group && this.leadMapper.map(group)),
    );
  }
}
