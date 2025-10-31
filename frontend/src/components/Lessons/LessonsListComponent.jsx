import React from "react";
import "./LessonsListComponent.css";

function LessonsListComponent({
  lessonNames,
  land,
  currentLesson,
  currentMinilesson,
}) {
  const backgroundImageUrl = land?.friendImage
    ? `url(${land.friendImage})`
    : "none";

  const landBackgrundImageLessonsList = {
    backgroundImage: `linear-gradient(0deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) 100%), ${backgroundImageUrl}`,
  };

  return (
    <div className="lessonsListContainer">
      <div className="chatContainer">
        <div className="chatHeader">
          <p className="chatHeaderText">Lessons list</p>
        </div>
        <div style={landBackgrundImageLessonsList} className="lessonsList">
          {lessonNames.map((lesson, lessonIndex) => {
            const isBeforeOrCurrentLesson = lessonIndex <= currentLesson;
            const lessonClass = isBeforeOrCurrentLesson ? "boldText" : "";

            return (
              <div key={lessonIndex}>
                <p className={lessonClass}>
                  {lessonIndex + 1}. {lesson.lessonName}
                </p>
                <div style={{ paddingLeft: "10px" }}>
                  {lesson.miniLessonsNames.map(
                    (miniLessonName, miniLessonIndex) => {
                      const isBeforeOrCurrentMiniLesson =
                        isBeforeOrCurrentLesson &&
                        (lessonIndex < currentLesson ||
                          miniLessonIndex <= currentMinilesson);
                      const miniLessonClass = isBeforeOrCurrentMiniLesson
                        ? "boldText"
                        : "";

                      const miniLessonStyle =
                        lessonIndex == currentLesson &&
                        miniLessonIndex == currentMinilesson
                          ? { color: "red" }
                          : {};

                      return (
                        <div
                          key={miniLessonIndex}
                          className={miniLessonClass}
                          style={miniLessonStyle}
                        >
                          {lessonIndex + 1}.{miniLessonIndex + 1}{" "}
                          {miniLessonName}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LessonsListComponent;
