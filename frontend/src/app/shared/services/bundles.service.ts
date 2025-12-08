import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface Bundle {
  id: string;
  name: string;
  description: string;
  discountPercentage: number;
  sessionCount: number;
  coverageType: string;
}

export interface BundlePurchase {
  id: string;
  bundleId: string;
  studentId: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class BundlesService {
  constructor(private api: ApiService) {}

  listBundles() {
    return this.api.get<Bundle[]>('/bundles/list');
  }

  getActiveBundles() {
    return this.api.get<Bundle[]>('/bundles/active');
  }

  purchaseBundle(bundleId: string, studentId: string) {
    return this.api.post<BundlePurchase>('/bundles/purchase', {
      bundleId,
      studentId,
    });
  }
}
