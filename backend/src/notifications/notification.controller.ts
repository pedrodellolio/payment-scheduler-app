import { Controller, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { NotificationPayloadDto } from './dto/notification-payload.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('new_notification')
  handleNewNotification(@Payload() data: NotificationPayloadDto) {
    this.notificationService.sendNotificationToUser(data);
  }
}
