import { Nullable } from '@internal/common';
import { Observable } from 'rxjs';

import { Id } from '@/domain/common';

import { Campaign, CampaignContact, ComplainedContact } from '../entities';

export interface CampaignRepository {
  getCampaignById(id: Id): Observable<Nullable<Campaign>>;
  updateCampaign(campaign: Campaign): Observable<void>;
  getNextPendingContacts(campaign: Id, quantity: number, exclude?: Id[]): Observable<CampaignContact[]>;
  updateContact(contact: CampaignContact): Observable<void>;
  saveContacts(contacts: CampaignContact[]): Observable<void>;
  createCampaign(campaign: Campaign): Observable<void>;
  saveComplaints(contacts: ComplainedContact[]): Observable<void>;
  getActiveCampaigns(): Observable<Campaign[]>;
}
