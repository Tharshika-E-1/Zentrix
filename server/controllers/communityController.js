import Community from "../models/Community.js";

export const publishPost = async (req, res) => {
  try {
    const { image, prompt } = req.body;

    const post = await Community.create({
      user: req.user._id,
      userName: req.user.name,
      image,
      prompt,
    });

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Community.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.likes += 1;
    await post.save();

    res.json({
      success: true,
      likes: post.likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Community.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};