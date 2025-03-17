import { useState, useEffect } from "react";
import { formatDuration } from "shared";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";

interface TimerProps {
  onSave?: (duration: number, title: string, description: string) => void;
}

export default function Timer({ onSave }: TimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime.getTime());
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime]);

  const handleStart = () => {
    if (!isRunning) {
      const now = new Date();
      setStartTime(now);
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    if (isRunning) {
      setIsRunning(false);
    } else if (startTime) {
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    if (startTime) {
      setIsRunning(false);

      if (onSave && title.trim()) {
        onSave(elapsedTime, title, description);
      }

      setStartTime(null);
      setElapsedTime(0);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Time Tracker</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="What are you working on?"
          className="input mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isRunning}
        />
        <textarea
          placeholder="Add description (optional)"
          className="input h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isRunning}
        />
      </div>

      <div className="text-4xl font-mono text-center mb-6">
        {formatDuration(elapsedTime)}
      </div>

      <div className="flex justify-center space-x-4">
        {!isRunning && !startTime ? (
          <button
            className="btn btn-primary flex items-center"
            onClick={handleStart}
            disabled={!title.trim()}
          >
            <FaPlay className="mr-2" /> Start
          </button>
        ) : (
          <>
            <button
              className="btn btn-primary flex items-center"
              onClick={handlePause}
            >
              {isRunning ? (
                <>
                  <FaPause className="mr-2" /> Pause
                </>
              ) : (
                <>
                  <FaPlay className="mr-2" /> Resume
                </>
              )}
            </button>
            <button
              className="btn btn-secondary flex items-center"
              onClick={handleStop}
            >
              <FaStop className="mr-2" /> Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
}
