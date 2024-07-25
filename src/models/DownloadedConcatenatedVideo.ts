import { DataTypes, Model, UUIDV4 } from "sequelize";
import sequelize from "../database/connection";

export default class DownloadedConcatenatedVideo extends Model {
    id!: string;
    createdAt!: Date;
    updatedAt!: Date;
}

DownloadedConcatenatedVideo.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: UUIDV4,
    },
}, {
    sequelize,
    tableName: 'DownloadedConcatenatedVideos',
    freezeTableName: true,
})