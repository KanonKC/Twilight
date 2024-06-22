import { getVaultVideo } from "../../services/get-vault-video";

getVaultVideo("https://www.youtube.com/watch?v=ng5Cq2YEaRU").then((video) => {
    console.log(video)
})