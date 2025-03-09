import useNoteStore from "../../../services/note.ts";


const Details = () => {
    const {
        title,
        setTitle,
        password,
        setPassword,
        tag,
        setTag,
        mood,
        setMood,
    } = useNoteStore();
    return (
        <div className="create-note-container-detail">
            Details
            <div className="detail-input">
                <input
                    type="text"
                    required
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="title">Title</label>
            </div>
            <div className="detail-input">
                <input
                    type="password"
                    required
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password">Password</label>
            </div>
            <div className="detail-input">
                <input
                    type="text"
                    required
                    id="tag"
                    name="tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                />
                <label htmlFor="tag">Tag</label>
            </div>
            <div className="detail-input">
                <input
                    type="text"
                    required
                    id="Mood"
                    name="Mood"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                />
                <label htmlFor="Mood">Mood</label>
            </div></div>
    );
};

export default Details;
