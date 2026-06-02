const { default: ImageKit, toFile } = require('@imagekit/nodejs');

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});


async function uploadFile({ buffer, fileName, folder="" }) {
    try{
        const fileResponse = await imagekit.files.upload({
            file: await toFile(Buffer.from(buffer), fileName),
            fileName: fileName,
            folder: folder
        });
        return fileResponse;
    }catch(error){
        console.log(error);
    }
};

module.exports = { uploadFile };