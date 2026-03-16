import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id })
      .sort({ updatedAt: -1 });// we need decending order

    res.json(conversations);
  } catch (err) {
    next(err);
  }
};

export const getConversationMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || conversation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const messages = await Message.find({
      conversationId: req.params.id
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    next(err);
  }
};

export const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || conversation.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await Message.deleteMany({ conversationId: req.params.id });
    await conversation.deleteOne();

    res.json({ message: "Conversation deleted" });
  } catch (err) {
    next(err);
  }
};

export const renameConversation = async (req, res, next) => {
  try {
    const { title } = req.body;
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || conversation.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    conversation.title = title;
    await conversation.save();

    res.json(conversation);
  } catch (err) {
    next(err);
  }
};