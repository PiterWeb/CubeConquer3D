export default interface IAttackble {
    get health(): number
    set health(newHealth: number)
	attack(targetID: string, damage: number): void;
	cure(healthCure: number): void
    receiveDamage(damage: number): void
    isDead():boolean
}
