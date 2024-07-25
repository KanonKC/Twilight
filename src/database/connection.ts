import { configDotenv } from "dotenv";
import { Dialect, Sequelize } from "sequelize";

// configDotenv();

const sequelize = new Sequelize(
	"videovaultdevdb",
	process.env.DATABASE_USER as string,
	process.env.DATABASE_PASSWORD as string,
	{
		host: process.env.DATABASE_HOST as string,
		dialect: process.env.DATABASE_DIALECT as Dialect,
	}
);

sequelize.sync({force: true}).then(() => {
	console.log('Database & tables created!');
})

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
	console.log('Database Name: ', process.env.DATABASE_NAME);
	console.log('Database User: ', process.env.DATABASE_USER);
	console.log('Database Host: ', process.env.DATABASE_HOST);
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

export default sequelize;

// CREATE USER 'stream'@'localhost' IDENTIFIED BY 'stream1q2w3e4r';
// GRANT ALL PRIVILEGES ON *.* TO 'stream'@'localhost' WITH GRANT OPTION;
// CREATE USER 'stream'@'%' IDENTIFIED BY 'stream1q2w3e4r';
// GRANT ALL PRIVILEGES ON *.* TO 'stream'@'%' WITH GRANT OPTION;
// FLUSH PRIVILEGES;