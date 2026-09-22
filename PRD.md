# Product Requirements Document (PRD)

## Project: BlindFold (VisionMate)
**What it is:** Real-time audio companion helping visually impaired users navigate obstacles and identify cash safely.  
**Author:** Anubhab  
**Status:** In Progress (MVP Phase)

---

## 1. The Problem

Walking down a street or campus corridor when you cannot see is genuinely stressful:

1. **White canes have blind spots:** A cane catches obstacles at foot level within ~1 meter. It won't warn you about an open truck tailgate, low tree branches, an open window shutter at chest height, or a chair someone just pulled out in front of you.
2. **Cash handling causes real anxiety:** Indian paper currency notes have small tactile bleed lines when fresh, but after a few weeks in circulation, those wear flat. When paying an auto driver or grocery vendor, visually impaired people often have to ask a bystander or just trust the vendor.
3. **Existing apps aren't built for walking speed:**
   - Apps like *Be My Eyes* connect to a live volunteer. That works for reading a letter at home, but you can't hold a 45-second call while trying to cross a busy college lobby.
   - Cloud AI apps (like GPT-4V / Gemini) have a 2-4 second round trip. By the time the cloud says "there's a pillar ahead", you've already walked into it.

---

## 2. Who We're Building For

**Primary Persona:** Rohan, 21. Second-year college student with total blindness from birth.

- **Routine:** Commutes by metro and walking, attends lectures across multiple campus buildings, buys lunch at the canteen using cash.
- **Tools:** Android phone with Google TalkBack, bone-conduction headphones (so his ears aren't plugged and he can still hear traffic).
- **Biggest pet peeves:** 
  - Having to hold someone's elbow just to walk from the library to the canteen.
  - Handing over a ₹500 note thinking it's ₹100 because the note felt the same.
  - Apps with tiny buttons or complicated multi-step menus that TalkBack struggles to cycle through.

---

## 3. MVP Scope (What We're Building First)

Keep it focused. We only want to solve the two biggest daily pain points first:

### 1. Obstacle & Proximity Voice Warnings
- Streams frames from the rear camera into a lightweight YOLOv8-nano model.
- Checks 3 horizontal zones: Left, Center, Right.
- Estimates distance based on bounding box size.
- Plays short, directional voice cues: *"Chair 2 steps ahead to your left"*, *"Clear path ahead"*.
- If an obstacle is directly in front and less than 1m away, it cuts off other audio and plays a sharp warning tone + phone buzz.

### 2. Quick Currency Reader
- Single tap on the screen snaps a picture and passes it to a MobileNetV3 classifier trained on current Indian banknotes (₹10, ₹20, ₹50, ₹100, ₹200, ₹500).
- Speaks the amount immediately: *"Five hundred rupees"*, paired with a haptic pulse pattern.
- Works even if the note is slightly crumpled, angled, or partially held by fingers.

### 3. Audio-First 4-Quadrant UI
- Screen divided into 4 big quadrants.
- Tap top-left for Obstacle mode, top-right for Currency mode.
- TalkBack and VoiceOver friendly, zero precision required.

---

## 4. What We Are NOT Building Right Now (And Why)

- **Turn-by-turn Outdoor GPS:** Standard phone GPS is off by 5–10 meters. That's fine for cars, but terrible for telling someone where a sidewalk ends. Google Maps already does turn-by-turn; our job is micro-navigation (what's 2 meters in front of you).
- **Custom Smart Glasses / Hardware:** Hardware takes months, costs \$300+, and battery life is tricky. A regular phone in a lanyard or shirt pocket works today for zero extra cost.
- **Facial Recognition / Social Profiling:** Huge privacy headache, requires user photo databases, and doesn't solve immediate safety needs.
- **Reading Whole Books / Long OCR:** Kindle, Voice Dream, and existing screen readers already do this well. We only care about short situational text (signs, room numbers) down the road in Phase 2.
- **Heavy Multimodal Cloud LLMs:** Too slow and expensive for a continuous 15 FPS walking stream.

---

## 5. Success Metrics (25-User Test)

Before calling this ready for daily use, we're testing it with a cohort of **25 visually impaired students and commuters**:

- **Latency:** Obstacle warning heard in under **350ms** on-device (or <600ms on network).
- **Currency Accuracy:** ≥ 95% correct recognition on folded or worn notes across 10 random cash tests.
- **Collision Avoidance:** Navigating an indoor test corridor with zero bumps into waist-height obstacles.
- **User Feedback:** ≥ 80% of testers feel confident using the cash reader without asking a sighted person to verify.
