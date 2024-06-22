import { DataTypes, ModelDefined, Optional } from "sequelize";
import sequelize from "../database";
import { DownloadedVideo } from "../types/Video";
import { DownloadVideoAttribute, DownloadVideoCreation, TrimmedVideoAttribute, TrimmedVideoCreation } from "./types";

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

// export const TrimmedVideoModel:ModelDefined<TrimmedVideoAttribute, TrimmedVideoCreation> = sequelize.define("TrimmedVideo", {
//     id: {
//         type: DataTypes.STRING,
//         primaryKey: true
//     },
//     title: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     filename: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     originalVideoId: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         references: {
//             model: DownloadVideoModel,
//             key: 'id'
//         }
//     },
//     originalStartSecond: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     originalEndSecond: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     }
// })

sequelize.sync().then(() => {
    console.log('DownloadVideoModel table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});