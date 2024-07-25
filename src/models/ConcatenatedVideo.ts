import { DataTypes, Model, UUIDV4 } from "sequelize";
import sequelize from "../database/connection";

export default class ConcatenatedVideo extends Model {
    id!: string;
    title!: string;
    filename!: string;
    createdAt!: Date;
    updatedAt!: Date;
}

ConcatenatedVideo.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: UUIDV4,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    tableName: 'ConcatenatedVideos',
    freezeTableName: true,
})