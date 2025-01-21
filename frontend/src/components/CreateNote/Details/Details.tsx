import React from "react";
import DateTimePicker from "../DateTimePicker/DateTimePicker";

interface DetailsProps {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    tag: string;
    setTag: React.Dispatch<React.SetStateAction<string>>;
    mood: string;
    setMood: React.Dispatch<React.SetStateAction<string>>;
    withReminder: boolean;
    setWithReminder: React.Dispatch<React.SetStateAction<boolean>>;
    reminderDate: Date | null;
    setReminderDate: React.Dispatch<React.SetStateAction<Date | null>>;
    withDeleter: boolean;
    setWithDeleter: React.Dispatch<React.SetStateAction<boolean>>;
    deletingDate: Date | null;
    setDeletingDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const Details: React.FC<DetailsProps> = ({
                                             title,
                                             setTitle,
                                             password,
                                             setPassword,
                                             tag,
                                             setTag,
                                             mood,
                                             setMood,
                                             withReminder,
                                             setWithReminder,
                                             reminderDate,
                                             setReminderDate,
                                             withDeleter,
                                             setWithDeleter,
                                             deletingDate,
                                             setDeletingDate,
                                         }) => {
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
            </div>
            <div className="calendar">
                <label htmlFor="reminder">Remind at</label>
                <div
                    className="calendar-input"
                    style={{
                        background: withReminder ? "var(--color)" : "transparent",
                    }}
                    onClick={() => setWithReminder(!withReminder)}
                ></div>
            </div>
            {withReminder && (
                <DateTimePicker datetime={reminderDate} setDateTime={setReminderDate} />
            )}
            <div className="calendar">
                <label htmlFor="deleter">Delete at</label>
                <div
                    className="calendar-input"
                    style={{
                        background: withDeleter ? "var(--color)" : "transparent",
                    }}
                    onClick={() => setWithDeleter(!withDeleter)}
                ></div>
            </div>
            {withDeleter && (
                <DateTimePicker datetime={deletingDate} setDateTime={setDeletingDate} />
            )}
        </div>
    );
};

export default Details;
