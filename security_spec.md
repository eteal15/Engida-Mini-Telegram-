# Security Specification for ENGIDA Firestore Security Rules

## 1. Data Invariants

### User Profile Invariant
*   A user profile can only be created/read/written by the owner matching the UID or an Admin.
*   Users are forbidden from elevating their own `role` or incrementing their `coins` balance directly without a verified Admin signature or specific, compliant state validation logs.
*   Only Admins can write documents to `/admins/{adminId}` which act as the trusted validation source.

### Stories Invariant
*   A story's `authorId` must match the authenticated user UID on creation.
*   Only the story author or an Admin can update stories. No user can self-approve their own story (only admins can set `isApproved` or `isFeatured` to `true`).

### Chapters Invariant
*   A chapter can only be created inside a story by the story's author.
*   The author cannot toggle `isLocked` to true directly; locks can only be activated by an Admin or upon Admin approval of a premium request.

### Comments Invariant
*   Comments can be listed under a story's chapters. Any authenticated user can write comments.
*   A user can only edit or delete comments they created.

### Coin & Unlock Transactions Invariant
*   A reader cannot unlock a chapter unless the unlock record is atomic, signed correctly, and represents a real coin flow.
*   Coin deposits (`coinTransactions`) can be proposed by readers with a `pending` status. Only Admins can transition the status to `approved` or `rejected`.

## 2. The "Dirty Dozen" Payloads

1.  **Identity Spoofing in Profiles**: Reader attempts to write a user profile document for another user's UID.
2.  **Privilege Escalation**: Reader attempts to change their own role to `"admin"` or `"writer"`.
3.  **Coin Counterfeiting**: Reader attempts to increase their own `coins` balance directly (from 10 to 99999).
4.  **Shadow Approvals for Stories**: Writer attempts to create a story with `isApproved: true` to bypass moderation.
5.  **Story Theft/Modification**: Malicious user attempts to update a story owned by another writer.
6.  **Admin Spoofing on Story Approvals**: Malicious writer attempts to update `isApproved: true` on an existing story.
7.  **Unauthorized Chapter Insertion**: Hacker attempts to create a chapter on a story they don't own.
8.  **Fake Coin deposits Approval**: User attempts to update a coin deposit transaction status to `approved` themselves.
9.  **Vandalizing Comments**: User attempts to change another user's comments.
10. **The PII Breach**: A random user attempts to query/read all user profiles with Telebirr numbers (`telebirrNumber`) or private phone data.
11. **Direct Payout Issuance**: A writer tries to create a verified `PayoutRecord` for themselves to claim real money.
12. **Self-Approval on Monetization Application**: Writer tries to approve their own `MonetizationRequest` by changing `status` to `approved`.

## 3. The Test Runner (`firestore.rules.test.ts`)

```typescript
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// In a real testing environment, this verifies that:
// 1. All "Dirty Dozen" payloads fail with PERMISSION_DENIED.
// 2. Safe operations (such as authors writing their own stories, readers unlocking chapters they have coins for) succeed.
```
