import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    // Check if req.user is av ailable
    if (!req.user) {
      return res.status(401).json({
        message: "Authorization required. Please log in to send messages.",
      });
    }

    const senderId = req.user._id;
    if (!senderId) {
      return res.status(401).json({
        message: "You are not authorized to access this route",
      });
    }
    //create conversation and setting sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    //create new message so i can push into conversation messages
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // SOCKET IO Functionality goes here

    await conversation.save();

    res.status(200).json({
      result: newMessage,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.log("error coming from messageController", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: chatToUserId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, chatToUserId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    return res.status(200).json({
      message: "Messages get successfully",
      result: messages,
    });
  } catch (error) {
    console.log("error in getMessages controller", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
