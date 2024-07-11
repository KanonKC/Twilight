import { DataTypes, ModelDefined, UUIDV4 } from "sequelize";
import sequelize from "../database";
import { ConcatenatedVideoAttribute, ConcatenatedVideoCreation, DownloadedVideoConcatenatedVideoAttribute, DownloadedVideoConcatenatedVideoCreation, DownloadVideoAttribute, DownloadVideoCreation } from "./types";

export const DownloadVideoModel:ModelDefined<
    DownloadVideoAttribute,
    DownloadVideoCreation
> = sequelize.define("DownloadedVideo", {
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
});

export const ConcatenatedVideoModel:ModelDefined<
    ConcatenatedVideoAttribute,
    ConcatenatedVideoCreation
> = sequelize.define("ConcatenatedVideo", {
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
    }
})

// export const DownloadedVideoConcatenatedVideoModel:ModelDefined<
//     DownloadedVideoConcatenatedVideoAttribute,
//     DownloadedVideoConcatenatedVideoCreation
// > = sequelize.define("DownloadedVideoConcatenatedVideo", {
//     id: {
//         type: DataTypes.STRING,
//         primaryKey: true,
//         defaultValue: UUIDV4,
//     },
//     // downloadedVideoId: {
//     //     type: DataTypes.STRING,
//     //     allowNull: false,
//     //     primaryKey: true,
//     // },
//     // concatenatedVideoId: {
//     //     type: DataTypes.STRING,
//     //     allowNull: false,
//     //     primaryKey: true,
//     // }
// })

// Create M-M Relationship between DownloadedVideo and ConcatenatedVideo
DownloadVideoModel.belongsToMany(ConcatenatedVideoModel, { through: "DownloadedVideoConcatenatedVideo" });
ConcatenatedVideoModel.belongsToMany(DownloadVideoModel, { through: "DownloadedVideoConcatenatedVideo" });

sequelize.sync({ force: true }).then(() => {
    console.log('All tables created and updated successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});