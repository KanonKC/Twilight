import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
	"VideoVaultDB",
	"stream",
	"stream1q2w3e4r",
	{
		host: "localhost",
		dialect: "mysql",
	}
);

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

export default sequelize;

// CREATE USER 'stream'@'localhost' IDENTIFIED BY 'stream1q2w3e4r';
// GRANT ALL PRIVILEGES ON *.* TO 'stream'@'localhost' WITH GRANT OPTION;
// CREATE USER 'stream'@'%' IDENTIFIED BY 'stream1q2w3e4r';
// GRANT ALL PRIVILEGES ON *.* TO 'stream'@'%' WITH GRANT OPTION;
// FLUSH PRIVILEGES;