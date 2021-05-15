import {
    Table,
    DataType,
    Column,
    Model,
    HasOne,
    HasMany,
    AutoIncrement,
    PrimaryKey,
    AllowNull, CreatedAt, UpdatedAt, ForeignKey
} from "sequelize-typescript";
import {User} from "./User";

@Table({
    timestamps: true
})
export class Item extends Model {

    @AutoIncrement
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.INTEGER)
    id: number

    @AllowNull(false)
    @Column(DataType.TEXT)
    title: string

    @ForeignKey(() => User)
    @Column(DataType.NUMBER)
    user_id: number

    @CreatedAt
    @Column(DataType.DATE)
    created_at: Date

    @UpdatedAt
    @Column(DataType.DATE)
    last_updated: Date
}
