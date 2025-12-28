"use client";

import { responsive, LABEL_STYLE, CATEGORY_INPUT_BOX_STYLE, MOOD_TAG_CONTAINER_STYLE, SITUATION_INPUT_STYLE } from "../constants";
import CategoryRadioGroup from "../components/CategoryRadioGroup";
import MoodTagList from "../components/MoodTagList";

interface AlbumInputSectionStep2Props {
  category: string;
  onCategoryChange: (value: string) => void;
  selectedTag?: string;
  onTagChange?: (tag: string) => void;
  situationValue?: string;
  onSituationChange?: (value: string) => void;
}

export default function AlbumInputSectionStep2({
  category,
  onCategoryChange,
  selectedTag = "",
  onTagChange,
  situationValue = "",
  onSituationChange,
}: AlbumInputSectionStep2Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={LABEL_STYLE}>
        카테고리 유형을 선택해주세요(1개 선택)
      </div>
      
      <div style={CATEGORY_INPUT_BOX_STYLE}>
        <CategoryRadioGroup
          value={category}
          onChange={onCategoryChange}
        />
      </div>
      
      {/* 기분 선택 시 */}
      {category === "mood" && (
        <div style={{ marginTop: responsive.vh(20) }}>
          <div style={LABEL_STYLE}>무엇을 추억하려고 만드시나요?</div>
          <div className="album-description-scroll" style={MOOD_TAG_CONTAINER_STYLE}>
            <MoodTagList
              selectedTag={selectedTag}
              onTagChange={onTagChange}
              showTitle={false}
            />
          </div>
        </div>
      )}
      
      {/* 상황 선택 시 */}
      {category === "situation" && (
        <div style={{ marginTop: responsive.vh(20) }}>
          <div style={LABEL_STYLE}>무엇을 추억하려고 만드시나요?</div>
          <textarea
            className="album-description-scroll"
            value={situationValue}
            onChange={(e) => onSituationChange?.(e.target.value)}
            placeholder="ex) 졸업식, 생일"
            style={SITUATION_INPUT_STYLE}
          />
        </div>
      )}
    </div>
  );
}

