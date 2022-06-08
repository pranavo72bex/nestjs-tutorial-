export class UserCreatedEvent {
    constructor(private readonly userId: string, public readonly email: string) { }
}