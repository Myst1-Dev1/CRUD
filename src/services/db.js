import mongoose from 'mongoose'

const NEXT_PUBLIC_MONGO_URI = "mongodb+srv://myst:123@cluster0.iorrpuk.mongodb.net/test";
const connection = {}

async function dbConnect() {
    if(connection.isConnected) {
        return
    }

    const db = await mongoose.connect(NEXT_PUBLIC_MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    connection.isConnected = db.connections[0].readyState
}

export default dbConnect
