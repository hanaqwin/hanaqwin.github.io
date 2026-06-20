export interface BirthdayConfig {
  recipientName: string;
  greeting: string;
  senderName: string;
  introText: string;
  switchHint: string;
  photoUrl: string;
  musicUrl: string;
  showBalloons: boolean;
  showCake: boolean;
  showMascot: boolean;
  enableSfx: boolean;
}

export const config: BirthdayConfig = {
  /** Name of the birthday person — shown big on the card. */
  recipientName: "Heiue Quyen",

  /** The greeting message. Line breaks are kept. Emojis welcome 🎉 */
  greeting: `Chúc mừng sinh nhật! 🎉

Thêm một tuổi, xinh thêm một chút, đáng yêu thêm vài phần — còn cân nặng thì cứ giữ nguyên nha! Chúc cậu một năm cười nhiều hơn khóc, gặp toàn người thương, và muốn gì được nấy.

Cứ mãi là chính mình thôi, vì như vậy là đã dễ thương lắm rồi. 💛`,

  /** Your name — appears as the handwritten signature on the card. */
  senderName: "Miaw 😼",

  /** The curious line that types itself out during the dark intro, then fades. */
  introText: "Hmm... why is it so dark in here?",

  /** Small hint shown under the light switch. */
  switchHint: "Click the switch to ✨",

  /**
   * Photo of the birthday person, shown in the center frame.
   * Leave "" to use the cute placeholder.
   * To use your own: drop the image into the `public/` folder and put
   * its file name here, e.g. "photo.jpg".
   */
  photoUrl: "main.jpg",

  /**
   * Background birthday song (starts after the light switch is flipped).
   * Drop your .mp3 into the `public/` folder and put its name here.
   * If the file is missing the site still works — music is just skipped.
   */
  musicUrl: "hbd_viet_song.mp3",

  // ── Optional fun extras — set any to false to turn it off ──────────
  showBalloons: true,
  showCake: true,
  showMascot: true,
  enableSfx: true,
};
