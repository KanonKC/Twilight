import { DataTypes, Model, UUIDV4 } from "sequelize";
import sequelize from "../database/connection";

export default class DownloadedVideo extends Model {
    id!: string;
    filaneme!: string;
    platform!: string;
    platformId!: string;
    title!: string;
    createdAt!: Date;
    updatedAt!: Date;
}

DownloadedVideo.init({
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
    platform: {
        type: DataTypes.STRING,
        allowNull: false
    },
    platformId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startRange: {
        type: DataTypes.STRING,
        allowNull: true
    },
    endRange: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    sequelize,
    tableName: 'DownloadedVideos',
    freezeTableName: true,
})
