import React, { useState } from 'react';
import styles from './RecordsConfig.module.css';

interface RecordsConfigProps {
  onClose: () => void;
}

const RecordsConfig: React.FC<RecordsConfigProps> = ({ onClose }) => {
  const [defaultScreen, setDefaultScreen] = useState('records');
  const [recordBookDefaultScreen, setRecordBookDefaultScreen] = useState('monthly');
  const [weekStart, setWeekStart] = useState('sunday');
  const [timeFormat, setTimeFormat] = useState('12hour');
  const [selectedRecordBook, setSelectedRecordBook] = useState('[기본] 업무');
  const [recordBookName, setRecordBookName] = useState('업무');
  const [shareNickname, setShareNickname] = useState('');
  const [defaultPermission, setDefaultPermission] = useState('full');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>기록장 설정</h2>
        <button 
          onClick={onClose}
          className={styles.closeButton}
        >
          ×
        </button>
      </div>
      
      <div className={styles.content}>
        {/* 일반 설정 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>일반 설정</h3>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>시스템 기본 화면</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="defaultScreen"
                  value="records"
                  checked={defaultScreen === 'records'}
                  onChange={(e) => setDefaultScreen(e.target.value)}
                />
                <span className={styles.radioText}>기록 관리</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="defaultScreen"
                  value="history"
                  checked={defaultScreen === 'history'}
                  onChange={(e) => setDefaultScreen(e.target.value)}
                />
                <span className={styles.radioText}>이력 관리</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="defaultScreen"
                  value="jobSearch"
                  checked={defaultScreen === 'jobSearch'}
                  onChange={(e) => setDefaultScreen(e.target.value)}
                />
                <span className={styles.radioText}>이직 관리</span>
              </label>
            </div>
          </div>
        </div>

        {/* 기록 관리 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>기록 관리</h3>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>기록장 기본 화면</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="recordBookDefaultScreen"
                  value="weekly"
                  checked={recordBookDefaultScreen === 'weekly'}
                  onChange={(e) => setRecordBookDefaultScreen(e.target.value)}
                />
                <span className={styles.radioText}>주별 보기</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="recordBookDefaultScreen"
                  value="monthly"
                  checked={recordBookDefaultScreen === 'monthly'}
                  onChange={(e) => setRecordBookDefaultScreen(e.target.value)}
                />
                <span className={styles.radioText}>월별 보기</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="recordBookDefaultScreen"
                  value="list"
                  checked={recordBookDefaultScreen === 'list'}
                  onChange={(e) => setRecordBookDefaultScreen(e.target.value)}
                />
                <span className={styles.radioText}>목록 보기</span>
              </label>
            </div>
          </div>

          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>한 주의 시작</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="weekStart"
                  value="sunday"
                  checked={weekStart === 'sunday'}
                  onChange={(e) => setWeekStart(e.target.value)}
                />
                <span className={styles.radioText}>일요일</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="weekStart"
                  value="monday"
                  checked={weekStart === 'monday'}
                  onChange={(e) => setWeekStart(e.target.value)}
                />
                <span className={styles.radioText}>월요일</span>
              </label>
            </div>
          </div>

          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>시간 표기 방식</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="timeFormat"
                  value="12hour"
                  checked={timeFormat === '12hour'}
                  onChange={(e) => setTimeFormat(e.target.value)}
                />
                <span className={styles.radioText}>12시간제</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="timeFormat"
                  value="24hour"
                  checked={timeFormat === '24hour'}
                  onChange={(e) => setTimeFormat(e.target.value)}
                />
                <span className={styles.radioText}>24시간제</span>
              </label>
            </div>
          </div>
        </div>

        {/* 기록장 관리 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>기록장 관리</h3>
          
          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>기록장 선택</label>
            <div className={styles.selectContainer}>
              <select 
                value={selectedRecordBook}
                onChange={(e) => setSelectedRecordBook(e.target.value)}
                className={styles.select}
              >
                <option value="[기본] 업무">[기본] 업무</option>
                <option value="[기본] 개인">[기본] 개인</option>
              </select>
            </div>
          </div>

          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>기록장 이름 및 색상</label>
            <div className={styles.nameColorContainer}>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={recordBookName}
                  onChange={(e) => setRecordBookName(e.target.value)}
                  className={styles.textInput}
                />
                <button className={styles.clearButton}>×</button>
              </div>
              <div className={styles.colorSwatch}></div>
            </div>
          </div>

          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>기록장 공유</label>
            <div className={styles.shareContainer}>
              <div className={styles.shareInputContainer}>
                <input
                  type="text"
                  placeholder="공유할 분의 닉네임을 입력해 주세요."
                  value={shareNickname}
                  onChange={(e) => setShareNickname(e.target.value)}
                  className={styles.shareInput}
                />
                <button className={styles.shareButton}>공유하기</button>
              </div>
              
              <div className={styles.sharedMembers}>
                <div className={styles.memberItem}>
                  <span className={styles.memberName}>나뚜루 녹차</span>
                  <select className={styles.permissionSelect}>
                    <option>보기 권한</option>
                    <option>전체 권한</option>
                  </select>
                  <button className={styles.removeButton}>×</button>
                </div>
                <div className={styles.memberItem}>
                  <span className={styles.memberName}>나뚜루 초코</span>
                  <select className={styles.permissionSelect}>
                    <option>전체 권한</option>
                    <option>보기 권한</option>
                  </select>
                  <button className={styles.removeButton}>×</button>
                </div>
              </div>
              
              <p className={styles.infoText}>공유 멤버가 있으면 기록장을 삭제할 수 없어요.</p>
            </div>
          </div>

          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>기록장 공유 기본 권한</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="defaultPermission"
                  value="full"
                  checked={defaultPermission === 'full'}
                  onChange={(e) => setDefaultPermission(e.target.value)}
                />
                <span className={styles.radioText}>전체 권한</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="defaultPermission"
                  value="view"
                  checked={defaultPermission === 'view'}
                  onChange={(e) => setDefaultPermission(e.target.value)}
                />
                <span className={styles.radioText}>보기 권한</span>
              </label>
            </div>
          </div>

          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>기록장 삭제</label>
            <p className={styles.infoText}>기본 기록장은 삭제할 수 없어요.</p>
          </div>

          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>기록장 삭제</label>
            <div className={styles.deleteContainer}>
              <button className={styles.deleteButton}>삭제하기</button>
              <p className={styles.infoText}>기록장에 있는 모든 기록이 삭제돼요.</p>
            </div>
          </div>

          <div className={styles.settingItem}>
            <label className={styles.settingLabel}>기록장 탈퇴</label>
            <div className={styles.leaveContainer}>
              <button className={styles.leaveButton}>탈퇴하기</button>
              <p className={styles.infoText}>탈퇴하면 더 이상 공유 기록장에 있는 기록을 볼 수 없어요.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordsConfig;
