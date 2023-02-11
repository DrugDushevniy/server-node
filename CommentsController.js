const CommentsBase = require("./bases/CommentsBase.js");


class CommentsController {

    async creates(req, res) {
        try {
            const {author, body, ids, date} = req.body;
            const addCommentToBase = await CommentsBase.create({author, body, ids, date})
            return res.json(addCommentToBase)
        } catch (err) {
            res.status(500).json(err)
        }
    }

    async getAll(req, res) {
        try {
            const comms = await CommentsBase.find();
            return res.json(comms)
        } catch (err) {
            res.status(500).json(err)
        }
    }

    async getOne(req, res) {
        const {id} = req.params;
        if (!id) {
            return res.status(500).json('ID не указан')
        }
        try {
            const comms = await CommentsBase.findById(id);
            return res.json(comms)
        } catch (err) {
            res.status(500).json(err)
        }
    }

    async updates (req, res) {
        const comment = req.body;
        if (!comment._id) {
            res.status(500).json('ID не указан')
        }
        try {
            const comms = await CommentsBase.findByIdAndUpdate(comment._id, comment, {new: true});
            return res.json(comms)
        } catch (err) {
            res.status(500).json(err)
        }
    }
    async deletes (req, res) {
        const {id} = req.params;
        if (!id) {
            return res.status(500).json('ID не указан')
        }
        try {
            const comms = await CommentsBase.findByIdAndDelete(id);
            return res.json(`Пост с ID ${id} успешно удален`)
        } catch (err) {
            res.status(500).json(err)
        }
    }


}

module.exports = new CommentsController();