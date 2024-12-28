export default interface IMovable {
    move(x: number, y: number): void
    stop(): void
    isMoving(): boolean
    isFalling(): boolean
}
