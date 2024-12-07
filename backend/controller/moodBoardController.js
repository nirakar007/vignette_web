import MoodBoard from "../model/moodBoardModel.js";

// create new mood board
export async function createMoodBoard(req, res) {
    try{
        const {title, description, items} = req.body;
        const moodBoard = new MoodBoard({
            title,
            description,
            items,
            userId: req.user.id,
        });

        const saveBoard = await moodBoard.save();
        res.status(201).json(saveBoard);
    }
    catch(err){
        res.status(500).json({error: "Failed to create mood board"});
    }
}

// get all mood boards for a user
export async function getMoodBoards(req, res) {
    try{
        const boards = await find({userId: req.user.id});
        res.status(200).json(boards);
    }
    catch(err){
        res.status(500).json({error: "Failed to fetch mood boards"});
    }
}


// get a single mood board by ID
export async function getMoodBoardById(req, res) {
    try{
        const board = await findById(req.params.id);
        if(!board || board.userId.toString() !== req.user.id){
            return res.status(400).json({error: "Mood board not found"});
        }
        res.status(200).json(board);
    }
    catch(err){
        res.status(500).json({error: "Failed to fetch mood board"});
    }
}


// update a mood board
export async function updateMoodBoard(req, res) {
    try{
        const {title, description, items} = req.body;
        const board = await findById(req.params.id);

        if(!board || board.userId.toString() !== req.user.id){
            return res.status(404).json({error: "Mood board not found."});
        }

        board.title = title || board.title;
        board.description = description || board.description;
        board.items = items || board.items;

        const updateBoard = await board.save();
        res.status(200).json(updateBoard);

    }
    catch(err){
        res.status(500).json({error: "Failed to update mood board"});
    }
}

// delete mood board
export async function deleteMoodBoard(req, res) {
    try{
        const board = await findById(req.params.id);

        if(!board || board.userId.toString() !== req.user.id){
            return res.status(404).json({error: "Mood board not found"});
        }

        await board.remove();
        res.status(200).json({error: "Mood board deleted."});
    }
    catch(err){
        res.status(500).json({error: "Failed to delete mood board.."});
    }
}