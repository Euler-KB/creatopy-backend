import {
    Table,
    DataType,
    Column,
    Model,
    HasOne,
    HasMany,
    AutoIncrement,
    PrimaryKey,
    AllowNull, CreatedAt, UpdatedAt
} from "sequelize-typescript";

@Table({ timestamps: true })
export class User extends Model{

    @AutoIncrement
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.INTEGER)
    id: number

    @Column(DataType.STRING)
    username: string

    @Column(DataType.STRING)
    password_hash: string

    @Column(DataType.STRING)
    password_salt: string

    @Column(DataType.STRING)
    password_reset_code: string

    @Column(DataType.STRING)
    name: string

    @Column(DataType.STRING)
    email: string

    @Column(DataType.STRING)
    phone: string

    @CreatedAt
    @Column(DataType.DATE)
    created_at: Date

    @UpdatedAt
    @Column(DataType.DATE)
    last_updated: Date
}
