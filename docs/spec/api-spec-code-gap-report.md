# API Spec vs Frontend Code Gap Report

Ngay tao: 2026-05-24  
Pham vi: doi chieu cac file `docs/spec/api-spec-*.md` voi frontend trong `src`.

## Tong Quan

Build hien tai van pass voi `npm run build`, nhung co mot so chenh lech contract giua API spec moi va frontend. Cac muc duoi day uu tien nhung loi co kha nang gay fail khi thao tac voi backend da cap nhat theo spec.

## 1. Exam template thieu cac field bat buoc moi

**Muc do:** Cao

**Spec**

`docs/spec/api-spec-exam.md` quy dinh `POST /admin/exams/templates` can cac field:

- `description`
- `criticalQuestions`
- `maxCriticalMistakes`
- `shuffleQuestions`
- `topicDistribution`

Trong do `criticalQuestions`, `maxCriticalMistakes`, `shuffleQuestions`, `topicDistribution` la field bat buoc khi tao template; `topicDistribution[].questionCount` phai cong bang `totalQuestions`.

**Code hien tai**

- `src/types/exam-template.types.ts` chi khai bao template voi cac field co ban: `name`, `licenseCategory`, `totalQuestions`, `passingScore`, `durationMinutes`, `isActive`, `isDeleted`, `version`, `createdById`, `createdAt`, `updatedAt`.
- `src/pages/AddExamConfigPage/index.tsx` khi tao template chi gui:
  - `name`
  - `licenseCategory`
  - `totalQuestions`
  - `passingScore`
  - `durationMinutes`
- UI khong co control de nhap `criticalQuestions`, `maxCriticalMistakes`, `shuffleQuestions`, hoac topic distribution.

**Anh huong**

Neu backend validate theo spec moi, thao tac tao de thi tren UI co the tra `400 VALIDATION_ERROR` hoac `INVALID_EXAM_TEMPLATE`.

**De xuat sua**

- Cap nhat `ExamTemplate`, `CreateExamTemplatePayload`, `UpdateExamTemplatePayload`, `ExamTemplateFormData`.
- Bo sung UI cau hinh:
  - so cau diem liet (`criticalQuestions`)
  - so loi diem liet toi da (`maxCriticalMistakes`)
  - tron cau hoi (`shuffleQuestions`)
  - danh sach topic + so cau moi topic (`topicDistribution`)
- Load topic tu `question-service` de user chon topic thay vi nhap UUID thu cong.

## 2. Exam session/history APIs trong spec chua co service/frontend

**Muc do:** Trung binh

**Spec**

`docs/spec/api-spec-exam.md` co cac endpoint:

- `GET /admin/exams/sessions`
- `GET /exams/sessions`
- `GET /exams/review/missed-questions`
- `GET /exams/sessions/:id/questions`
- `PATCH /exams/sessions/:id/answers`
- `POST /exams/sessions/:id/submit`
- `GET /exams/sessions/:id/result`

Spec ASR cung bo sung filter lich su:

- `status`
- `isPassed`
- `from`
- `to`

**Code hien tai**

- `src/services/exam.service.ts` chi co CRUD cho `/admin/exams/templates`.
- Chua co type cho `ExamSession`, `ExamResult`, `MissedQuestion`.
- `src/pages/StudentDetailPage/index.tsx` van hien placeholder "exam-service duoc tich hop".

**Anh huong**

Admin/instructor dashboard hoac student detail khong the hien lich su thi, ket qua thi, missed question review theo spec moi.

**De xuat sua**

- Tao type rieng cho exam session/result/review.
- Mo rong `examService` voi admin session list va student-facing endpoints neu frontend admin can dung.
- Thay placeholder trong student detail bang call `GET /admin/exams/sessions?studentId=...`.

## 3. Course status thieu `ARCHIVED` va chua co archive endpoint

**Muc do:** Trung binh

**Spec**

`docs/spec/api-spec-course.md` quy dinh:

- `CourseStatus`: `DRAFT | ACTIVE | ARCHIVED`
- `DELETE /admin/courses/:id` archive course, khong hard delete
- archived courses bi loai khoi list mac dinh, tru khi filter `status=ARCHIVED`

**Code hien tai**

- `src/types/course.types.ts` chi khai bao `CourseStatus = 'DRAFT' | 'ACTIVE'`.
- `COURSE_STATUS_LABELS` va `COURSE_STATUS_OPTIONS` khong co `ARCHIVED`.
- `src/services/course.service.ts` chua co ham `archive`/`delete`.
- `src/pages/CourseManagementPage/index.tsx` khong co action archive, khong hien status archived.

**Anh huong**

Neu backend tra course co `status = "ARCHIVED"`, UI co the khong map duoc label/class. Admin cung khong co cach archive course theo spec.

**De xuat sua**

- Them `ARCHIVED` vao type, label, option, pill class.
- Them `courseService.archive(id)` goi `DELETE /admin/courses/:id`.
- Bo sung action archive trong course detail/list neu product can thao tac nay.

## 4. Course enrollment/reset-progress APIs chua duoc model hoa

**Muc do:** Thap den trung binh

**Spec**

`docs/spec/api-spec-course.md` co cac endpoint student-facing:

- `POST /courses/:id/enroll`
- `GET /enrollments`
- `GET /enrollments/:id`
- `POST /enrollments/:id/lessons/:lessonId/complete`
- `POST /enrollments/:id/reset-progress`

**Code hien tai**

- `src/services/course.service.ts` chi co admin course CRUD/lesson/material.
- Chua co type `EnrollmentResponse`, `EnrollmentStatus`.
- Chua co service/function cho reset progress.

**Anh huong**

Frontend admin hien tai co the chua can dung, nhung neu student/admin progress UI duoc bat len thi chua co client contract de goi.

**De xuat sua**

- Tao type enrollment theo spec.
- Neu admin UI can xem/reset tien do, them service/function va trang tuong ung.

## 5. User `license-tier` response typed sai

**Muc do:** Trung binh

**Spec**

`docs/spec/api-spec-user.md` quy dinh `PATCH /admin/users/:id/license-tier` tra `200 OK` voi `data` la profile da cap nhat.

**Code hien tai**

`src/services/user.service.ts` khai bao:

```ts
apiService.patch<ApiResponse<null>>(`/admin/users/${id}/license-tier`, { licenseTier })
```

**Anh huong**

Code hien tai chi kiem tra success nen chua vo ngay, nhung type sai lam frontend khong dung duoc profile tra ve. Neu can update UI tu response, se phai fetch lai hoac bi TypeScript can.

**De xuat sua**

Sua return type thanh `ApiResponse<UserProfile>`.

## 6. Cac endpoint `204 No Content` dang di qua wrapper `ApiResponse`

**Muc do:** Trung binh

**Spec**

Hai endpoint tra `204 No Content`:

- `PATCH /admin/users/:id/lock`
- `DELETE /admin/media/files/:id`

**Code hien tai**

- `src/services/user.service.ts` khai bao `setLock` la `ApiResponse<null>`.
- `src/services/media.service.ts` khai bao `delete` la `ApiResponse<null>`.
- `withErrorHandling` trong `src/utils/error.ts` chi coi thanh cong khi `response.data?.success` truthy.

**Anh huong**

Neu endpoint tra dung 204 va khong co body, wrapper co the coi day la failure voi message generic, du HTTP request thanh cong.

**De xuat sua**

- Ho tro 204 trong `withErrorHandling`, hoac tao wrapper rieng cho no-content endpoints.
- Doi type service ve dang no-content thay vi `ApiResponse<null>`.

## 7. Anh cau hoi khi edit phu thuoc sai vao `imageUrl`

**Muc do:** Cao

**Spec**

`docs/spec/api-spec-question.md` noi frontend nen dung `mediaFileId` de goi `GET /media/files/:mediaFileId/url`. `imageUrl` chi la blob URL/fallback va co the khong doc truc tiep duoc khi container private.

**Code hien tai**

Trong `src/pages/AddQuestionPage/index.tsx`, khi load question edit:

```ts
if (q.mediaFileId && q.imageUrl) {
  setImage({ mediaFileId: q.mediaFileId, publicUrl: q.imageUrl });
}
```

**Anh huong**

Neu backend tra `mediaFileId` nhung `imageUrl = null`, UI khong hien anh. Khi user luu lai, payload co the gui `mediaFileId: null`, lam mat lien ket anh cau hoi.

**De xuat sua**

- Chi can `q.mediaFileId` la set duoc image reference.
- `ImageUploader` da dung `useMediaUrl(mediaFileId)` nen co the resolve presigned URL.
- Co the cho `MediaReference.publicUrl` optional hoac fallback bang `q.imageUrl ?? ""`.

## 8. Media delete response typed sai voi spec

**Muc do:** Trung binh

**Spec**

`docs/spec/api-spec-media.md` quy dinh `DELETE /admin/media/files/:id` tra `204 No Content`.

**Code hien tai**

`src/services/media.service.ts`:

```ts
apiService.delete<ApiResponse<null>>(`/admin/media/files/${id}`)
```

**Anh huong**

Neu UI sau nay dung `mediaService.delete`, xoa thanh cong co the bi hien thanh loi generic do khong co `response.data.success`.

**De xuat sua**

Dung chung fix o muc 6 cho no-content endpoint.

## 9. Notification spec da co nhung UI van placeholder

**Muc do:** Trung binh

**Spec**

`docs/spec/api-spec-notification.md` co:

- `POST /admin/academic-warnings`
- `GET /notifications/me`
- `PATCH /notifications/:id/read`

**Code hien tai**

- Khong co `notification.service.ts`.
- `src/pages/StudentDetailPage/index.tsx` van comment "Notification backend chua co" va chi hien toast local khi bam gui canh bao.
- Header/sidebar chua co notification list hoac read state.

**Anh huong**

Tinh nang gui canh bao hoc tap khong thuc su goi backend theo spec moi.

**De xuat sua**

- Tao `notification.service.ts`.
- Noi modal "Gui Canh Bao" trong student detail vao `POST /admin/academic-warnings`.
- Them notification menu/list neu can theo `GET /notifications/me`.

## 10. Analytics spec moi chua duoc dung, dashboard van data tinh

**Muc do:** Trung binh

**Spec**

`docs/spec/api-spec-analytics.md` co:

- `GET /analytics/me/progress`
- `GET /admin/analytics/students/:studentId/progress`

**Code hien tai**

- Khong co `analytics.service.ts`.
- `src/pages/DashboardPage/index.tsx` lay data tu `src/data/dashboardData.ts`.
- `src/pages/DashboardGiangVienPage/index.tsx` lay data tu `src/data/dashboardGiangVienData.ts`.
- `StudentDetailPage` chua load progress theo student.

**Anh huong**

Dashboard va student progress khong phan anh du lieu backend moi.

**De xuat sua**

- Tao `analytics.service.ts` voi progress dashboard type.
- Doi dashboard/student detail tu mock data sang API, co loading/empty/error state.

## 11. Audit spec moi chua co client

**Muc do:** Thap den trung binh

**Spec**

`docs/spec/api-spec-audit.md` co:

- `GET /admin/audit-logs`
- `GET /admin/audit-logs/:id`

**Code hien tai**

- Khong co `audit.service.ts`.
- Chua co route/page audit logs.
- Cac mutation frontend khong can goi audit-service de ghi log, nhung admin investigation/history UI theo spec chua co.

**Anh huong**

Admin chua tra cuu duoc audit trail trong frontend.

**De xuat sua**

- Tao service va page audit logs neu day la scope cua admin dashboard.
- Bo sung filter theo `serviceName`, `action`, `resourceType`, `resourceId`, `actorId`, `from`, `to`.

## 12. Simulation spec moi chua co client

**Muc do:** Thap den trung binh

**Spec**

`docs/spec/api-spec-simulation.md` co:

- `GET /simulation/maneuvers`
- `GET /simulation/maneuvers/:id`
- `GET /simulation/maneuver-errors`
- `POST /simulation/sessions`
- `PATCH /simulation/sessions/:id/answers`
- `POST /simulation/sessions/:id/submit`

**Code hien tai**

- Khong co `simulation.service.ts`.
- Khong co route/page simulation trong `src/App.tsx`.
- Sidebar chua co entry simulation.

**Anh huong**

Frontend admin hien tai chua su dung simulation-service. Neu product yeu cau hien thi/noi dung mo phong, can bo sung client rieng.

**De xuat sua**

- Tao type/service cho simulation.
- Them route/page khi co yeu cau UI.

## 13. Auth refresh response type thieu metadata so voi spec

**Muc do:** Thap

**Spec**

`POST /auth/refresh` tra:

- `accessToken`
- `refreshToken`
- `expiresIn`
- `refreshExpiresIn`
- `tokenType`
- `scope`

**Code hien tai**

`src/services/auth.service.ts` khai bao `AuthTokens` chi co:

```ts
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
```

Interceptor trong `src/lib/api.ts` cung chi can `accessToken`.

**Anh huong**

Khong gay loi hien tai, nhung type khong day du voi contract.

**De xuat sua**

Dung lai `LoginResponseData` cho refresh response hoac mo rong `AuthTokens`.

## De Xuat Uu Tien Sua

1. Sua exam template payload/UI theo spec moi.
2. Sua edit question image de khong mat `mediaFileId`.
3. Ho tro response `204 No Content` trong wrapper/service.
4. Them `ARCHIVED` va archive course.
5. Noi notification warning neu modal gui canh bao la tinh nang can chay that.
6. Tao service cho analytics/audit/simulation theo muc do uu tien san pham.

## Lenh Kiem Tra Da Chay

```bash
npm run build
```

Ket qua: build thanh cong. Vite canh bao chunk lon hon 500 kB sau minification.
