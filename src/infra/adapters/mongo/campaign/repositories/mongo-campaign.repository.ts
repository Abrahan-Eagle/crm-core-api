import { mapToVoid, Nullable, OptimisticLockingException, throwIfVoid } from '@internal/common';
import { MongoTransactionContextStorage } from '@internal/mongo';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { map, mergeMap, Observable, of } from 'rxjs';

import { CollectionNames, InjectionConstant } from '@/app/common';
import {
  Campaign,
  CAMPAIGN_CONTACT_STATUS,
  CampaignContact,
  CampaignRepository,
  ComplainedContact,
} from '@/domain/campaign';
import { Id } from '@/domain/common';

import { CampaignContactDocument, CampaignDocument, ComplaintDocument } from '../documents';
import { CampaignContactMapper, CampaignMapper, ComplaintMapper } from '../mappers';

@Injectable()
export class MongoCampaignRepository implements CampaignRepository {
  constructor(
    @InjectModel(InjectionConstant.CAMPAIGN_MODEL)
    private readonly campaignModel: Model<CampaignDocument>,
    private readonly campaignMapper: CampaignMapper,
    @InjectModel(InjectionConstant.CAMPAIGN_CONTACT_MODEL)
    private readonly contactModel: Model<CampaignContactDocument>,
    private readonly contactMapper: CampaignContactMapper,

    @InjectModel(InjectionConstant.COMPLAINT_MODEL)
    private readonly complaintModel: Model<ComplaintDocument>,
    private readonly complaintMapper: ComplaintMapper,

    private readonly context: MongoTransactionContextStorage,
  ) {}

  saveComplaints(contacts: ComplainedContact[]): Observable<void> {
    return of(contacts).pipe(
      map((contacts) => this.complaintMapper.reverseMapFromList(contacts)),
      mergeMap((documents) =>
        this.complaintModel.bulkWrite(
          documents.map((document) => ({
            insertOne: {
              document,
            },
          })),
          {
            session: this.context.getStore()?.session,
          },
        ),
      ),
      mapToVoid(),
    );
  }

  updateCampaign(campaign: Campaign): Observable<void> {
    return of(campaign).pipe(
      map((campaign) => this.campaignMapper.reverseMap(campaign)),
      mergeMap((update) =>
        this.campaignModel.findOneAndUpdate({ _id: update._id }, update, {
          runValidators: true,
          new: false,
          session: this.context.getStore()?.session,
        }),
      ),
      mapToVoid(),
    );
  }

  saveContacts(contacts: CampaignContact[]): Observable<void> {
    return of(contacts).pipe(
      map((contacts) => this.contactMapper.reverseMapFromList(contacts)),
      mergeMap((documents) =>
        this.contactModel.bulkWrite(
          documents.map((document) => ({
            insertOne: {
              document,
            },
          })),
          {
            session: this.context.getStore()?.session,
          },
        ),
      ),
      mapToVoid(),
    );
  }

  createCampaign(campaign: Campaign): Observable<void> {
    return of(campaign).pipe(
      map((campaign) => this.campaignMapper.reverseMap(campaign)),
      mergeMap((doc) => this.campaignModel.create([doc], { session: this.context.getStore()?.session })),
      mapToVoid(),
    );
  }

  getCampaignById(id: Id): Observable<Nullable<Campaign>> {
    return of(id).pipe(
      map((id) => new Types.ObjectId(id.toString())),
      mergeMap((_id) => this.campaignModel.findOne({ _id })),
      map((doc) => doc && this.campaignMapper.map(doc)),
    );
  }

  getActiveCampaigns(): Observable<Campaign[]> {
    return of().pipe(
      mergeMap(() =>
        this.campaignModel
          .aggregate<CampaignDocument>()
          .match({
            job_id: {
              $ne: null,
            },
          })
          .lookup({
            from: CollectionNames.CAMPAIGN_CONTACT,
            localField: '_id',
            foreignField: 'campaign_id',
            as: 'contacts',
            pipeline: [
              {
                $match: {
                  status: 'PENDING',
                },
              },
              {
                $group: {
                  _id: 'campaign_id',
                  total: { $count: {} },
                },
              },
            ],
          })
          .unwind({
            path: '$contacts',
            preserveNullAndEmptyArrays: false,
          })
          .exec(),
      ),
      map((docs) => this.campaignMapper.mapFromList(docs)),
    );
  }

  getNextPendingContacts(id: Id, quantity: number, exclude: Id[]): Observable<CampaignContact[]> {
    return of(id).pipe(
      map((id) => new Types.ObjectId(id.toString())),
      mergeMap((campaign_id) =>
        this.contactModel
          .find<CampaignContactDocument>({
            campaign_id,
            status: CAMPAIGN_CONTACT_STATUS.PENDING,
            _id: { $nin: exclude.map((id) => new Types.ObjectId(id.toString())) },
          })
          .limit(quantity)
          .exec(),
      ),
      map((docs) => this.contactMapper.mapFromList(docs)),
    );
  }

  updateContact(contact: CampaignContact): Observable<void> {
    return of(contact).pipe(
      map((contact) => this.contactMapper.reverseMap(contact)),
      mergeMap((contactDocument) => {
        const { _id, version, ...update } = contactDocument;
        return this.contactModel.findOneAndUpdate({ _id, version }, update, {
          runValidators: true,
          new: false,
          session: this.context.getStore()?.session,
        });
      }),
      throwIfVoid(() => {
        const message = `Version error, Contact not found for [Id:${contact.contactId.toString()}], and [version:${
          contact.version
        }]`;
        return new OptimisticLockingException(message);
      }),
      mapToVoid(),
    );
  }
}
