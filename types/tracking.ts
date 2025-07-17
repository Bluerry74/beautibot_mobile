import { IAddress } from '@/app/types/product';
import { IDelivery, IOrder } from './order';

export interface ITrackingData {
  delivery: IDelivery;
  order: IOrder;
  address: IAddress;
}