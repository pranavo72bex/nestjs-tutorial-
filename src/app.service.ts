import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { createUserRequest } from './dto/create-user.request';
import { UserCreatedEvent } from './events/user-created.events';

@Injectable()
export class AppService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private schedulerRegistry: SchedulerRegistry,
  ) { }
  private readonly logger = new Logger(AppService.name)
  getHello(): string {
    return 'Hello World!';
  }
  async createUser(body: createUserRequest) {
    this.logger.log('creating user ...', body)
    const fakeUserId = '123'
    this.eventEmitter.emit('user.created', new UserCreatedEvent(fakeUserId, body.email))
    const establishWebSocketTimeOut = setTimeout(() => this.establishedConnection(fakeUserId), 4000);
    this.schedulerRegistry.addTimeout(`${fakeUserId}_establish_ws`, establishWebSocketTimeOut)
  }
  private establishedConnection(fakeUserId: string) {
    this.logger.log('Establishing ws connection with users...', fakeUserId)
  }
  @OnEvent('user.created')
  welcomeNewUser(payload: UserCreatedEvent) {
    this.logger.log('welcoming new user...', payload.email)
  }
  @OnEvent('user.created', { async: true })
  async sendWelcomeGift(payload: UserCreatedEvent) {
    this.logger.log('sending welcome gifts ...', payload.email);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 5000))
    this.logger.log('gift send...', payload.email);
  }
  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'delete_expired_user' })
  deleteExpireuser() {
    this.logger.log('deleting user in every ten seconds')
  }
}
