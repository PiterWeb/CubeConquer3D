import IAttackable from "@/entities/interfaces/IAttackable";
import IMovable from "@/entities/interfaces/IMovable";

export default interface IUnit extends IAttackable, IMovable {}