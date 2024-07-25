import { DataTypes, Model, ModelDefined, UUIDV4 } from "sequelize";
import sequelize from "../database/connection";
import { ConcatenatedVideoAttribute, ConcatenatedVideoCreation, DownloadedVideoConcatenatedVideoAttribute, DownloadedVideoConcatenatedVideoCreation, DownloadVideoAttribute, DownloadVideoCreation } from "./types";

// export const DownloadVideoModel:ModelDefined<
//     DownloadVideoAttribute,
//     DownloadVideoCreation
// > = sequelize.define("DownloadedVideo", {
//     id: {
//         type: DataTypes.STRING,
//         primaryKey: true,
//         defaultValue: UUIDV4,
//     },
//     title: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     filename: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     platform: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     platformId: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     startRange: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     endRange: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
// });

// export const ConcatenatedVideo:ModelDefined<
//     ConcatenatedVideoAttribute,
//     ConcatenatedVideoCreation
// > = sequelize.define("ConcatenatedVideo", {
//     id: {
//         type: DataTypes.STRING,
//         primaryKey: true,
//         defaultValue: UUIDV4,
//     },
//     title: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     filename: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// })

// export const DownloadedVideoConcatenatedVideo:ModelDefined<
//     DownloadedVideoConcatenatedVideoAttribute,
//     DownloadedVideoConcatenatedVideoCreation
// > = sequelize.define("DownloadedVideoConcatenatedVideo", {})

// Create M-M Relationship between DownloadedVideo and ConcatenatedVideo
// DownloadVideoModel.belongsToMany(ConcatenatedVideo, { through: "DownloadedVideoConcatenatedVideo" });
// ConcatenatedVideo.belongsToMany(DownloadVideoModel, { through: "DownloadedVideoConcatenatedVideo" });

// export class DownloadedVideo extends Model {
//     id!: string;
//     filaneme!: string;
//     platform!: string;
//     platformId!: string;
//     title!: string;
//     createdAt!: Date;
//     updatedAt!: Date;
// }

// DownloadedVideo.init({
//     id: {
//         type: DataTypes.STRING,
//         primaryKey: true,
//         defaultValue: UUIDV4,
//     },
//     title: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     filename: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     platform: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     platformId: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     startRange: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     endRange: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
// }, {
//     sequelize,
//     tableName: 'DownloadedVideo',
//     freezeTableName: true,
// })

// sequelize.sync({ force: true }).then(() => {
//     console.log('All tables created and updated successfully!');
// }).catch((error) => {
//     console.error('Unable to create table : ', error);
// });