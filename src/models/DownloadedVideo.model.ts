import { DataTypes, ModelDefined, Optional } from "sequelize";
import sequelize from "../database";
import { DownloadedVideo } from "../types/Video";

export interface DownloadVideoAttribute {
    id: string;
    title: string;
    filename: string;
    platform: string;
    platformId: string;
}

export interface DownloadVideoCreation extends DownloadVideoAttribute {}

export const DownloadVideoModel:ModelDefined<DownloadVideoAttribute,DownloadVideoCreation> = sequelize.define("DownloadedVideo", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
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
    }
});

sequelize.sync().then(() => {
    console.log('DownloadVideoModel table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});