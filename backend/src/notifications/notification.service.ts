import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationPayloadDto } from './dto/notification-payload.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly gateway: NotificationGateway) {}

  sendNotificationToUser(data: NotificationPayloadDto) {
    this.gateway.server.emit('new_notification', JSON.stringify(data));
  }
}
