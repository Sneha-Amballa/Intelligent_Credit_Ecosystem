const Chat = require("../models/chat");
const zlib = require('zlib');

const getChatForUserAndLocation = async (req, res) => {
  const { username, location_id } = req.query;

  try {
    const chatDoc = await Chat.findOne({ username, location_id: parseInt(location_id) });

    if (chatDoc) {
      // Decompress each message in the nested array structure
      const decompressedMessagesList = chatDoc.messagesList.map(message => {
          const buffer = Buffer.from(message.compressedContent, 'base64');
          const decompressed = zlib.gunzipSync(buffer).toString();
          return {
            sender: message.sender,
            content: decompressed
        }
      }
      );

      res.status(200).json({
        success: true,
        messages: decompressedMessagesList
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No chat document found for the specified username and location_id."
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getHistoryMessages = async (username, location_id) => {

  try {
    const chatDoc = await Chat.findOne({ username, location_id: parseInt(location_id) });

    if (chatDoc) {
      // Decompress each message in the nested array structure
      const decompressedMessagesList = chatDoc.messagesList.map(message => {
          const buffer = Buffer.from(message.compressedContent, 'base64');
          const decompressed = zlib.gunzipSync(buffer).toString();
          return {
            sender: message.sender,
            content: decompressed
        }
      }
      );

      return decompressedMessagesList.slice(-3);
    }
  } catch (error) {
    console.log(error);
  }
};

const saveMessage = async (username, sender, location_id, message) => {

  try{
        
    const newMessage = {
      sender: sender,
      compressedContent: zlib.gzipSync(message).toString('base64')    
    };

    // Find or create a document for the user and module
    let chatDoc = await Chat.findOne({ username, location_id });
    
    if (!chatDoc) {
        chatDoc = new Chat({ username, location_id, messagesList: [newMessage] });
    }else{
      chatDoc.messagesList.push(newMessage);
    }

    // Save the updated document
    await chatDoc.save();

    console.log(`Message for user ${username} added successfully.`);


  } catch(error){
    console.log(`Error adding message for user ${username}.`);
  }

};

const deleteChat = async (username) => {

  try {
    await Chat.deleteMany({ username: username });
    console.log(`Chat for user ${username} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting chat: ", error);
  }

};

const deleteChatByLocationId = async (username, location_id) => {

  try {
    await Chat.deleteOne({ username: username, location_id: location_id });
    console.log(`Chat for user ${username} at location ${location_id} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting chat: ", error);
  }

};

module.exports = {
  getChatForUserAndLocation,
  saveMessage,
  deleteChat,
  deleteChatByLocationId,
  getHistoryMessages
};