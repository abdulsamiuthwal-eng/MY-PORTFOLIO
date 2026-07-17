import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Cpu, 
  Shield, 
  Zap, 
  Layers, 
  Code, 
  LineChart, 
  Terminal,
  Activity,
  AlertTriangle,
  Play,
  Pause,
  Eye,
  Sliders,
  Send,
  UploadCloud,
  UserPlus,
  ArrowRight,
  Database
} from 'lucide-react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Define structural data for all 6 projects
interface ProjectData {
  title: string;
  category: string;
  client: string;
  timeline: string;
  role: string;
  techStack: string;
  overview: string;
  challenge: string;
  solution: string;
  highlights: { icon: any; title: string; desc: string }[];
  metrics: { num: string; label: string }[];
  codeSnippet: string;
  fileName: string;
  flowchart: { badge: number; title: string; desc: string }[];
  screenshots: { url: string; caption: string }[];
  nextProjectId: string;
  liveDemoUrl?: string | null;
  repoUrl?: string | null;
}

const projectsMasterData: Record<string, ProjectData> = {
  'vigilant-eye': {
    title: 'Vigilant Eye — Intelligent Real-Time AI Surveillance & Threat Detection System',
    category: 'Artificial Intelligence / Computer Vision / Full-Stack Engineering',
    client: 'Advanced Security Prototype (Enterprise/Retail Surveillance)',
    timeline: 'Aug 2025 – May 2026',
    role: 'Lead AI & Pipeline Developer (Designed and implemented the core detection pipeline, multithreaded camera architecture, and real-time alert dispatch system)',
    techStack: 'Python, YOLOv8 (Ultralytics), OpenCV, Flask, Flask-SocketIO, SQLite (SQLAlchemy), SMTP (Secure Multi-Recipient OTP Alerting), Firebase Cloud Messaging (FCM), Eventlet, JavaScript, CSS3',
    liveDemoUrl: 'https://vigilant-eye-gold.vercel.app',
    repoUrl: 'https://github.com/abdulsamiuthwal-eng/PART-2-TASK_4Context-Aware-Chatbot-Using-LangChain-or-RAG.git',
    overview: 'Vigilant Eye is a state-of-the-art AI-driven surveillance platform engineered for real-time security monitoring and threat detection in retail and restricted environments. The system processes multiple concurrent camera feeds on a highly optimized, multithreaded backend to detect people, track movements, and classify suspicious actions (like shoplifting or unauthorized entry). The platform features an interactive, high-end dashboard that streams live feeds using SocketIO, triggers instant desktop warnings, sends secure OTP-verified email alerts, and broadcasts mobile push notifications via Firebase when a breach occurs.',
    challenge: `• The CPU/GPU Overload: Running deep learning object detection (YOLOv8) on multiple HD camera feeds simultaneously blocks Flask’s main request-response thread, causing extreme frame drops, latency, and system crashes.

• Network & Camera Drops: Local webcams and remote RTSP streams frequently encounter network lags or physical disconnections, which would lock up standard OpenCV pipelines and freeze the UI feed.

• CUDA Out-of-Memory (OOM): Initializing, running, and dynamically retraining object detection models on consumer-grade GPUs easily exceeds VRAM capacities.

• Notification Reliability: Standard SMTP alerts can block frame loops during delivery, and unverified destination addresses increase the risk of alert failure.`,
    solution: `• Multithreaded Frame Decoupling: Implemented a thread-safe CameraStream model where frame capture, YOLO inference, and bounding box drawing are offloaded to individual background threads, freeing the main thread to stream to the client dashboard at a smooth 30 FPS.

• Robust Reconnection Engine: Built an asynchronous camera reconnection mechanism with validation timeouts (5s threshold) and automatic background retry loops, preventing stream freezes during hardware drops.

• Efficient Memory & Performance Tweaks: Optimized GPU execution with Automatic Mixed Precision (AMP), lowered batch sizes, and integrated a FramePreprocessor to downscale and normalize frames before feeding them to the neural network.

• Asynchronous Multi-Channel Alerts: Wrapped email SMTP and Firebase Push Notifications in non-blocking tasks. Developed a secure system where recipients must verify their inbox with an OTP before receiving security snapshots.`,
    highlights: [
      { icon: Sliders, title: 'Smart Spatial Zone & Dwell-Time Logic', desc: 'Allows operators to configure coordinates for custom zones. The system calculates centroids of tracked individuals and triggers high-severity alarms if a subject dwells inside a zone beyond a configured safety threshold.' },
      { icon: Zap, title: 'Asynchronous Multi-Channel Alerts', desc: 'Delivers instant security events across three channels simultaneously: real-time SocketIO dashboard toasts, Firebase mobile push notifications, and detailed SMTP emails containing event coordinates and camera snapshots.' },
      { icon: Shield, title: 'Multi-Recipient OTP Verification System', desc: 'Features a secure, double-opt-in email alert list. To prevent spam and misdirected alerts, recipients are required to verify their email address via a secure 6-digit OTP code before receiving sensitive camera snapshots.' },
      { icon: Cpu, title: 'Live AI Training Panel & Hot-Reloading', desc: 'Designed an interactive training panel in the dashboard that allows administrators to upload custom datasets, run training loops on the server, and hot-reload updated model weights without restarting the app.' }
    ],
    metrics: [
      { num: '30 FPS', label: 'Processing & Streaming Speed' },
      { num: '<25ms', label: 'Average Inference Latency' }
    ],
    fileName: 'detector.py',
    codeSnippet: `# detection/detector.py
import cv2
import logging
from config import DETECTION_CONFIG

logger = logging.getLogger(__name__)

class TheftDetector:
    def __init__(self):
        self.model = self._load_model()
        self.device = DETECTION_CONFIG["device"] # 0 for GPU, fallback to 'cpu'
        
    def process_frame(self, frame, camera_id):
        """
        Runs YOLOv8 model inference on incoming frame, checks coordinates 
        against defined zones, and triggers alerts asynchronously.
        """
        if self.model is None or frame is None:
            return frame, []

        detections = []
        try:
            h, w = frame.shape[:2]
            
            # Run optimized YOLOv8 object detection on GPU
            results = self.model(frame, conf=0.25, classes=None, verbose=False, device=self.device)
            
            if len(results[0].boxes) > 0:
                frame = results[0].plot() # Annotate frame with boxes & labels
                
                for box in results[0].boxes:
                    cls_id = int(box.cls[0])
                    conf = float(box.conf[0])
                    coords = box.xyxy[0].tolist()
                    cls_name = self.model.names[cls_id]
                    
                    # Calculate center point of detected object
                    x_center = (coords[0] + coords[2]) / 2
                    y_center = (coords[1] + coords[3]) / 2
                    zone = self._get_zone(x_center, y_center, w, h)
                    
                    detections.append({
                        "camera_id": camera_id,
                        "activity_type": cls_name,
                        "confidence": conf,
                        "bbox": coords
                    })
                    
                    # Alert logic: trigger for threat classes or unauthorized area breaches
                    if cls_name in ["suspicious_person", "theft_action"] or (cls_name == "person" and zone == "Zone_C_Exit"):
                        self._fire_alert(camera_id, cls_name, conf, frame)
                        
        except Exception as e:
            logger.error(f"Error processing frame: {e}")
            
        return frame, detections`,
    flowchart: [
      { badge: 1, title: 'Multithreaded Video Capture', desc: 'Background camera threads pull raw frames from USB/IP sources via OpenCV and manage auto-reconnection parameters dynamically.' },
      { badge: 2, title: 'AI Processing & Inference', desc: 'The frame is downscaled, loaded to VRAM, and parsed through YOLOv8 to identify persons and threat categories.' },
      { badge: 3, title: 'Behavior & Boundary Mapping', desc: 'Centroids of detected targets are mapped against spatial bounding zones to check for zone breaches and calculate dwell times.' },
      { badge: 4, title: 'Asynchronous Notification Routing', desc: 'Verified threat detections trigger UI updates (SocketIO), SMTP emails with snapshots, and mobile push notifications.' }
    ],
    screenshots: [
      { url: '/projects/vigilant-eye/img1.jpg', caption: 'Vigilant Eye Splash and Camera Connection Initialization Screen' },
      { url: '/projects/vigilant-eye/img2.jpg', caption: 'Administrator Portal Secure Login Interface' },
      { url: '/projects/vigilant-eye/img3.jpg', caption: 'Real-Time Multithreaded Live Video Feed with YOLOv8 Object Detection and Labels' },
      { url: '/projects/vigilant-eye/img4.jpg', caption: 'Advanced Threats & Detections Statistical Analytics Dashboard' },
      { url: '/projects/vigilant-eye/img5.jpg', caption: 'Surveillance Settings, Email Alerts and Detection Confidence Level Threshold Dashboard' }
    ],
    nextProjectId: 'rag-chatbot'
  },
  'rag-chatbot': {
    title: 'RAG Research Assistant — RAG Chatbot (Llama 3.1 & ChromaDB)',
    category: 'RAG System / AI Chatbot',
    client: 'DevelopersHub Internship (Academic Project)',
    timeline: 'June 2026',
    role: 'AI/ML Engineering Intern (Solo Developer)',
    techStack: 'Python, LangChain, ChromaDB, Groq (Llama 3.1 70B), Streamlit, sentence-transformers (all-MiniLM-L6-v2)',
    liveDemoUrl: 'https://samiuthwal-scholarai.hf.space/',
    repoUrl: 'https://github.com/abdulsamiuthwal-eng/PART-2-TASK_4Context-Aware-Chatbot-Using-LangChain-or-RAG.git',
    overview: 'Context-Aware Conversational RAG Chatbot that answers questions about AI/ML research papers. Downloads 10 seminal papers from arXiv, chunks them, embeds with all-MiniLM-L6-v2, stores in ChromaDB, and retrieves relevant chunks via MMR search before generating grounded answers using Groq\'s Llama 3.1 70B.',
    challenge: 'LLMs hallucinate on niche AI/ML questions and hard to ground answers in real research papers. Raw text extraction from complex arXiv PDFs introduces noisy chunks. Retrieving too many chunks exceeds the LLM context window while too few leads to incomplete answers.',
    solution: 'Built a complete RAG pipeline: downloads arXiv papers via PyPDF → RecursiveCharacterTextSplitter (chunk_size=1000, overlap=200) → all-MiniLM-L6-v2 embeddings → ChromaDB persistent storage → MMR retrieval (fetch_k=20, top_k=5, lambda_mult=0.7) → Groq Llama 3.1 70B generates grounded, cited answers with source references.',
    highlights: [
      { icon: Database, title: 'Multi-turn Conversation Memory (K=5)', desc: 'ConversationBufferWindowMemory retains last 5 Q&A turns; question condensing with LLM ensures follow-ups work correctly.' },
      { icon: Layers, title: 'MMR Retrieval for Diverse Results', desc: 'Max Marginal Relevance fetches 20 candidates, re-ranks to top 5 balancing relevance + diversity across multiple papers.' },
      { icon: Shield, title: 'Source Document Viewer', desc: 'Each answer shows which arXiv paper chunks were used, with cosine similarity scores, chunk previews, and direct arXiv links.' },
      { icon: Code, title: 'Model Switching', desc: 'Swap between 5 Groq models (Llama 3.1 70B/8B, Mixtral, Gemma) from the UI without restarting.' }
    ],
    metrics: [
      { num: '0.853', label: 'Avg Relevance Score' },
      { num: '2.4s', label: 'Avg Latency' }
    ],
    fileName: 'rag/chain.py',
    codeSnippet: `# rag/chain.py — RAGChain.ask() method

class RAGChain:
    def ask(self, question: str) -> Dict[str, Any]:
        scored_docs = self._retriever_wrapper.retrieve_with_scores(question)
        result = self._chain.invoke({"question": question})
        answer = result.get("answer", "I could not generate a response.")
        source_docs = result.get("source_documents", [])
        scores = [score for _, score in scored_docs[:len(source_docs)]]
        self.memory_manager.add_exchange(question, answer)
        return {
            "answer": answer,
            "source_documents": source_docs,
            "scores": scores,
            "question": question,
            "model": self.model_name,
        }`,
    flowchart: [
      { badge: 1, title: 'Paper Download & Chunking', desc: 'arXiv PDFs → PyPDF → RecursiveCharacterTextSplitter (chunk_size=1000, overlap=200).' },
      { badge: 2, title: 'Vector Embedding & ChromaDB Index', desc: 'all-MiniLM-L6-v2 → 384-dim normalized vectors → stored persistently in data/chroma_db.' },
      { badge: 3, title: 'MMR Semantic Retrieval', desc: 'Query → embed → fetch_k=20 → MMR re-rank → top k=5 (lambda_mult=0.7 balances relevance vs diversity).' },
      { badge: 4, title: 'Llama 3.1 Grounded Answer', desc: 'Standalone question + context → Groq Llama 3.1 70B → grounded, cited answer with source references.' }
    ],
    screenshots: [
      { url: '/projects/rag-chatbot/img1.jpg', caption: 'RAG Research Assistant — Splash & Landing Screen' },
      { url: '/projects/rag-chatbot/img2.jpg', caption: 'RAG Chatbot — Main Chat Interface & Response Screen' },
      { url: '/projects/rag-chatbot/img3.jpg', caption: 'RAG Chatbot — Conversation & Knowledge Retrieval View' },
      { url: '/projects/rag-chatbot/img4.jpg', caption: 'RAG Chatbot — Source Citations & Paper References' },
      { url: '/projects/rag-chatbot/img5.jpg', caption: 'RAG Chatbot — Evaluation Benchmark Results' },
      { url: '/projects/rag-chatbot/img6.jpg', caption: 'RAG Chatbot — Settings & Model Configuration Panel' }
    ],
    nextProjectId: 'cloud-assign'
  },
  'cloud-assign': {
    title: 'CloudAssign — Cloud-Based Assignment Submission',
    category: 'Cloud & Web Apps',
    client: 'College Department / Automated Grading Portal',
    timeline: 'Oct 2025 - Dec 2025',
    role: 'Lead Full Stack & DevOps Engineer',
    techStack: 'Node.js, Express, React, Docker, AWS (S3, ECS), MongoDB',
    overview: 'CloudAssign is a scalable cloud native assignment submission portal built to streamline course management. It enables students to upload assignments, tracks deadlines via automated cron alerts, and uses sandboxed runner environments to execute and grade submitted programming scripts.',
    challenge: 'Running student-submitted code scripts is highly risky as they can execute malicious commands, crash the server, or trigger memory leaks. The system had to support concurrent script execution while isolating each submission in a safe sandbox.',
    solution: 'Designed a microservices architecture using Docker containers for sandboxed code execution. Student scripts are pulled from AWS S3, ran inside ephemeral, resource-constrained Docker containers, and tested against pre-defined test suites. The results are logged to MongoDB and immediately updated on the React dashboard.',
    highlights: [
      { icon: Layers, title: 'Sandboxed Code Runners', desc: 'Runs student C++/Python/Java scripts inside isolated Docker containers with 50MB RAM limit.' },
      { icon: Database, title: 'AWS S3 Storage Gateway', desc: 'High-durability file uploads with signed URLs and instant virus scanning.' },
      { icon: Zap, title: 'Auto-Grading Engine', desc: 'Runs unit test scripts and updates scores dynamically on submission.' },
      { icon: Shield, title: 'Deadlines Cron Daemon', desc: 'Auto-locks assignment folders and emails reminders to pending candidates.' }
    ],
    metrics: [
      { num: '0%', label: 'Sandbox Escape Rate' },
      { num: '2.8s', label: 'Avg Test Run Duration' }
    ],
    fileName: 'sandbox_runner.js',
    codeSnippet: `const { exec } = require('child_process');
const fs = require('fs');

function executeStudentCode(studentFilePath, testCasesPath) {
  return new Promise((resolve, reject) => {
    // Docker command to run code in isolated, resource-constrained environment
    const dockerCmd = \`docker run --rm \\
      -v \${studentFilePath}:/app/code.cpp \\
      -v \${testCasesPath}:/app/tests.json \\
      --memory="50m" --cpus="0.5" \\
      cpp-runner-image\`;

    exec(dockerCmd, { timeout: 8000 }, (error, stdout, stderr) => {
      if (error && error.killed) {
        return resolve({ status: "TIMEOUT", score: 0, error: "Execution Timeout (Time Limit Exceeded)" });
      }
      if (stderr) {
        return resolve({ status: "COMPILATION_ERROR", score: 0, error: stderr });
      }
      try {
        const results = JSON.parse(stdout);
        resolve({ status: "SUCCESS", score: results.score, passed: results.passed });
      } catch (e) {
        resolve({ status: "RUNTIME_ERROR", score: 0, error: "Invalid Output Format" });
      }
    });
  });
}`,
    flowchart: [
      { badge: 1, title: 'PDF/Code Submission', desc: 'Student uploads assignment file to React dashboard.' },
      { badge: 2, title: 'S3 Upload', desc: 'Node backend uploads file to secure AWS S3 bucket.' },
      { badge: 3, title: 'Docker Sandboxing', desc: 'Container spins up, downloads code, and runs tests in sandbox.' },
      { badge: 4, title: 'MongoDB & Client Alert', desc: 'Results logged in DB; UI updates grade and feedback.' }
    ],
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', caption: 'Student Assignment Dashboard & Team Collaboration Interface' },
      { url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', caption: 'AWS Cloud Infrastructure & Docker Container Management' }
    ],
    nextProjectId: 'smart-queue'
  },
  'smart-queue': {
    title: 'Smart Queue Management System',
    category: 'Python & Firebase Backend',
    client: 'Commercial Prototype / Bank Branch Operations',
    timeline: 'Aug 2025 - Sep 2025',
    role: 'Backend Architect & Database Engineer',
    techStack: 'Python, FastAPI, Firebase Realtime DB, React Native',
    overview: 'Smart Queue is a digital queue coordinator that eliminates physical queues. Customers register via QR code to get virtual tickets. The backend automatically coordinates VIP/Regular prioritization, updates queue status in real-time, and notifies customers when their turn approaches.',
    challenge: 'Synchronization delays can lead to duplicate token calls or deadlocks in high-traffic ticket windows. The queue state must be synchronized globally in under 200ms across multiple desk operator screens.',
    solution: 'Utilized Firebase Realtime Database triggers for immediate state synchronization. Developed a FastAPI backend using Python\'s asyncio to process ticket requests and sort queues using custom priority-weight sorting. Desks pull tickets using atomic database transactions.',
    highlights: [
      { icon: Activity, title: 'Real-time Synchronization', desc: 'Instantly updates token numbers across all displays with <100ms lag.' },
      { icon: Layers, title: 'Weighted Priority Queue', desc: 'Dynamic priority adjustment based on service type and wait time.' },
      { icon: Zap, title: 'Real-time Push Alerts', desc: 'SMS and push notifications triggered when 2 tickets remain ahead.' },
      { icon: LineChart, title: 'Desk Analytics Dashboard', desc: 'Visual charts showing operator efficiency and average wait times.' }
    ],
    metrics: [
      { num: '99.98%', label: 'System Uptime' },
      { num: '42%', label: 'Wait Time Reduction' }
    ],
    fileName: 'queue_manager.py',
    codeSnippet: `import firebase_admin
from firebase_admin import db
import asyncio

# Initialize Firebase SDK
cred = firebase_admin.credentials.Certificate("firebase-sdk.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://smart-queue-realtime.firebaseio.com/'
})

def serve_next_ticket(desk_id, service_type):
    ref = db.reference('queues/' + service_type)
    
    # Run atomic transaction to secure ticket without duplicates
    def serve_transaction(current_value):
        if current_value is None:
            return {}
        tickets = sorted(current_value.items(), key=lambda x: (x[1].get('vip', False), x[1].get('timestamp', 0)))
        if not tickets:
            return None
        next_ticket_id = tickets[0][0]
        current_value[next_ticket_id]['served'] = True
        current_value[next_ticket_id]['desk'] = desk_id
        return current_value

    try:
        ref.transaction(serve_transaction)
        return {"status": "SUCCESS"}
    except Exception as e:
        return {"status": "TRANSACTION_FAILED", "error": str(e)}`,
    flowchart: [
      { badge: 1, title: 'QR Ticket Request', desc: 'Customer scans QR code on phone and inputs details.' },
      { badge: 2, title: 'FastAPI Priority Sort', desc: 'FastAPI structures ticket and inserts into Firebase with weights.' },
      { badge: 3, title: 'Firebase State Sync', desc: 'Realtime DB pushes queue state to displays instantly.' },
      { badge: 4, title: 'Desk Operator Serves', desc: 'Operator clicks Next, fetching top ticket using transactions.' }
    ],
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', caption: 'Main Lobby Queue Status Display Board' },
      { url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80', caption: 'Operator Desk Dashboard Interface' },
      { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80', caption: 'Queue Management System — Customer Flow & Ticketing' }
    ],
    nextProjectId: 'project-census'
  },
  'project-census': {
    title: 'Project Census — Android Data Collection App',
    category: 'Android Mobile App',
    client: 'Government Internship / Field Ingestion System',
    timeline: 'Jun 2025 - Jul 2025',
    role: 'Android Developer',
    techStack: 'Kotlin, Android SDK, Room SQLite, WorkManager, Firebase',
    overview: 'Project Census is a offline-first Android application designed for census surveyors working in remote areas. It provides rich data collection forms, geo-tags surveyor coordinates, and synchronizes cached SQLite data to Firebase Firestore as soon as internet connection is detected.',
    challenge: 'Surveyors in rural areas have zero network connectivity. The application must guarantee zero data loss, store records securely in local SQLite databases, capture valid GPS coordinate markers, and sync data in the background without draining the battery.',
    solution: 'Built an offline-first architecture using Room database (SQLite wrapper). Implemented Android WorkManager for scheduling data syncing jobs with network constraints. Built background GPS tracking utilizing fused location providers for battery-optimized location tagging.',
    highlights: [
      { icon: Layers, title: 'Offline-First Synchronization', desc: 'Caches forms locally in Room and syncs via WorkManager jobs when network returns.' },
      { icon: Shield, title: 'Cryptographic Local Storage', desc: 'Encrypts SQL database files on-device to protect citizen confidentiality.' },
      { icon: Cpu, title: 'Battery-Optimized GPS Tagging', desc: 'Uses FusedLocationProviderClient to capture surveyor GPS coordinates.' },
      { icon: Code, title: 'Dynamic Form Validator', desc: 'Custom form field validation to prevent human input errors on field.' }
    ],
    metrics: [
      { num: '100%', label: 'Data Recovery Offline' },
      { num: '15%', label: 'Battery Consumption Drop' }
    ],
    fileName: 'SyncWorker.kt',
    codeSnippet: `package com.sami.census.sync

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.sami.census.data.AppDatabase
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

class SyncWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        val db = AppDatabase.getDatabase(applicationContext)
        val firestore = FirebaseFirestore.getInstance()
        val pendingRecords = db.censusDao().getUnsyncedRecords()

        if (pendingRecords.isEmpty()) return Result.success()

        try {
            for (record in pendingRecords) {
                // Sync record to cloud Firestore
                firestore.collection("census_records").document(record.id).set(record).await()
                db.censusDao().markAsSynced(record.id)
            }
            return Result.success()
        } catch (e: Exception) {
            return Result.retry()
        }
    }
}`,
    flowchart: [
      { badge: 1, title: 'Field Data Entry', desc: 'Surveyor inputs household census info on app.' },
      { badge: 2, title: 'Room SQLite Cache', desc: 'App saves records locally with GPS tags in database.' },
      { badge: 3, title: 'WorkManager Monitor', desc: 'Background service checks for internet connectivity.' },
      { badge: 4, title: 'Cloud Sync', desc: 'Uploads unsynced rows to Firestore in background.' }
    ],
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80', caption: 'Household Details Data Entry Screen' },
      { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80', caption: 'Surveyor GPS Coverage Map Interface' },
      { url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=1200&q=80', caption: 'Field Survey & Data Collection Workflow' }
    ],
    nextProjectId: 'library-system'
  },
  'library-system': {
    title: 'Library Management System',
    category: 'C++ OOP Console App',
    client: 'Academic Project / Object-Oriented Software Principles',
    timeline: 'Mar 2025 - May 2025',
    role: 'Solo Developer',
    techStack: 'C++, Object-Oriented Programming, File Streams, Data Structures',
    overview: 'A console-based Library Management system showcasing object-oriented software engineering principles in C++. It manages book inventories, borrower records, issue/return logs, and fine calculations using binary file handling for persistent data storage.',
    challenge: 'Designing a console application that persists structural object relations (User-Book relationships) without SQL database. It required developing custom file-seek and indexing mechanisms in binary files.',
    solution: 'Implemented custom binary file read/write streams using fstream. Developed structural inheritance (Student and Teacher classes inheriting from User base class) and utilized pointers and references for memory management. Built search algorithms using hashing.',
    highlights: [
      { icon: Code, title: 'Class Inheritance Hierarchy', desc: 'User base class with Student and Teacher subclasses overriding limits.' },
      { icon: Database, title: 'Binary File Persistence', desc: 'Custom file serialization and pointer-seeking for database records persistence.' },
      { icon: Zap, title: 'Fine Calculation Algorithm', desc: 'Automatic day-offset calculations and penalty assignment.' },
      { icon: Layers, title: 'Hash-Based Search', desc: 'Binary search algorithm on sorted books list to locate entries instantly.' }
    ],
    metrics: [
      { num: 'O(log N)', label: 'Book Search Speed' },
      { num: '100%', label: 'File Read Persistence' }
    ],
    fileName: 'library_system.cpp',
    codeSnippet: `#include <iostream>
#include <fstream>
#include <cstring>
using namespace std;

class Book {
    int bookId;
    char title[50];
    char author[50];
    bool isIssued;
public:
    void createBook() {
        cout << "Enter Book ID: "; cin >> bookId;
        cout << "Enter Book Title: "; cin.ignore(); cin.getline(title, 50);
        cout << "Enter Author Name: "; cin.getline(author, 50);
        isIssued = false;
    }
    void saveToBinary() {
        ofstream fout("books.dat", ios::binary | ios::app);
        fout.write(reinterpret_cast<char*>(this), sizeof(*this));
        fout.close();
    }
    int getBookId() { return bookId; }
};`,
    flowchart: [
      { badge: 1, title: 'Console Menu Input', desc: 'User inputs action code (e.g. 1. Add Book).' },
      { badge: 2, title: 'Hashed Search', desc: 'Searches sorted book list in memory using Binary Search.' },
      { badge: 3, title: 'File Stream Open', desc: 'Opens binary file stream in read/write mode.' },
      { badge: 4, title: 'Object Read/Write', desc: 'Deserializes/Serializes object structures and prints response.' }
    ],
    screenshots: [
      { url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1200&q=80', caption: 'Interactive Library System Terminal Console' },
      { url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80', caption: 'Binary File Storage and Record Indexing Diagram' },
      { url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80', caption: 'Library Management System — Book Inventory & Records' }
    ],
    nextProjectId: 'vigilant-eye'
  }
};

interface ProjectDetailPageProps {
  projectId: string;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'architecture'>('architecture');

  const handleBackToHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.hash = '#project';
  };

  // Retrieve current project data with a safe fallback
  const currentProject = projectsMasterData[projectId] || projectsMasterData['vigilant-eye'];

  // Interactive Simulators States
  const [simActive, setSimActive] = useState(true);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [confidenceRate, setConfidenceRate] = useState(0);
  
  // Specific Scenario for Vigilant Eye
  const [vigilantMode, setVigilantMode] = useState<'idle' | 'intruder' | 'hazard'>('idle');

  // RAG Chatbot Simulator States
  const [ragQuery, setRagQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'bot'; text: string; sources?: string[] }[]>([
    { sender: 'bot', text: 'Hello! I am your RAG Knowledge Base Assistant. Ask me anything about our data library.' }
  ]);
  const [ragInferenceState, setRagInferenceState] = useState<'idle' | 'embedding' | 'retrieving' | 'reranking' | 'generating'>('idle');

  // CloudAssign Simulator States
  const [uploadProgress, setUploadProgress] = useState(0);
  const [runnerState, setRunnerState] = useState<'idle' | 'uploading' | 'booting' | 'testing' | 'done'>('idle');
  const [runnerLogs, setRunnerLogs] = useState<string[]>([]);

  // Smart Queue Simulator States
  const [ticketQueue, setTicketQueue] = useState<{ id: string; vip: boolean; type: string }[]>([
    { id: 'T-042', vip: false, type: 'Cashier' },
    { id: 'V-015', vip: true, type: 'Loans' },
    { id: 'T-043', vip: false, type: 'Support' }
  ]);
  const [queueLogs, setQueueLogs] = useState<string[]>([
    'VIP Token V-015 registered for Desk 02.',
    'Token T-042 waiting in queue (Est. wait: 8 mins).'
  ]);
  const [servingToken, setServingToken] = useState<string>('T-041');

  // Project Census Simulator States
  const [censusName, setCensusName] = useState('');
  const [censusRegion, setCensusRegion] = useState('');
  const [censusSize, setCensusSize] = useState('4');
  const [networkOnline, setNetworkOnline] = useState(false);
  const [censusSyncStatus, setCensusSyncStatus] = useState<'synced' | 'unsynced' | 'syncing'>('synced');
  const [localDatabaseRecords, setLocalDatabaseRecords] = useState<number>(12);

  // Library Console Simulator States
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleHistory, setConsoleHistory] = useState<string[]>([
    '--- LIBRARY PERSISTENT SYSTEM CONSOLE ---',
    '1. Search for Books',
    '2. Issue a Book',
    '3. Display Borrowed Log',
    '4. Add a New Book Record',
    'Enter Selection Code (1-4): '
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const feedScreenRef = useRef<HTMLDivElement>(null);

  // Reset states when projectId changes
  useEffect(() => {
    setActiveTab('architecture');
    setSimActive(true);
    setConfidenceRate(0);
    
    // Reset Vigilant Eye
    setVigilantMode('idle');
    setSimLogs([
      `[SYSTEM] ${currentProject.title} engine initialized.`,
      `[OK] Pipeline setup established.`,
      `[SYSTEM] Heartbeat status: RUNNING.`
    ]);

    // Reset Chatbot
    setChatMessages([
      { sender: 'bot', text: `Hello! I am your ${currentProject.title} assistant. Ask me anything.` }
    ]);
    setRagInferenceState('idle');
    setRagQuery('');

    // Reset CloudAssign
    setUploadProgress(0);
    setRunnerState('idle');
    setRunnerLogs([]);

    // Reset Queue
    setTicketQueue([
      { id: 'T-042', vip: false, type: 'Cashier' },
      { id: 'V-015', vip: true, type: 'Loans' },
      { id: 'T-043', vip: false, type: 'Support' }
    ]);
    setServingToken('T-041');
    setQueueLogs([
      'VIP Token V-015 registered.',
      'Token T-042 waiting in queue (Est. wait: 8 mins).'
    ]);

    // Reset Census
    setCensusName('');
    setCensusRegion('');
    setCensusSize('4');
    setNetworkOnline(false);
    setCensusSyncStatus('synced');
    setLocalDatabaseRecords(12);

    // Reset Library
    setConsoleInput('');
    setConsoleHistory([
      '--- LIBRARY PERSISTENT SYSTEM CONSOLE ---',
      '1. Search for Books',
      '2. Issue a Book',
      '3. Display Borrowed Log',
      '4. Add a New Book Record',
      'Enter Selection Code (1-4): '
    ]);

    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [projectId]);

  // GSAP Entrance Animations
  useGSAP(() => {
    gsap.fromTo('.ptf-project-details-title',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }
    );
    
    gsap.fromTo('.ptf-project-details-category',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
    );

    gsap.fromTo('.ptf-project-links a',
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.15, duration: 0.8, delay: 0.3, ease: 'power3.out' }
    );

    gsap.fromTo('.ptf-project-meta-item',
      { y: 35, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, delay: 0.4, ease: 'power3.out' }
    );


  }, { scope: containerRef, dependencies: [projectId] });

  // 1. Vigilant Eye Simulation Loop
  useEffect(() => {
    if (projectId !== 'vigilant-eye' || !simActive) return;

    const timer = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();
      let newLog = '';

      if (vigilantMode === 'idle') {
        const idleMessages = [
          `[OK] Stream 01 clean. Scanning for motion events...`,
          `[INFO] Target count: 0 inside perimeter boundary.`,
          `[SYSTEM] Heartbeat OK. Frame inference time: 12ms.`,
          `[SYSTEM] Temp: 58°C - GPU Fan Speed: 34%`
        ];
        newLog = `[${timestamp}] ${idleMessages[Math.floor(Math.random() * idleMessages.length)]}`;
        setConfidenceRate(0);
      } else if (vigilantMode === 'intruder') {
        const intruderMessages = [
          `[ALERT] Motion trigger at Zone B (North Boundary).`,
          `[INFERENCE] Human profile identified in forbidden polygon.`,
          `[ACTION] Pushing Firebase Cloud alert with event index #729.`,
          `[ALERT] Tracking Target_A (confidence: ${Math.floor(Math.random() * 5) + 94}%).`
        ];
        newLog = `[${timestamp}] ${intruderMessages[Math.floor(Math.random() * intruderMessages.length)]}`;
        setConfidenceRate(Math.floor(Math.random() * 5) + 94);
      } else if (vigilantMode === 'hazard') {
        const hazardMessages = [
          `[CRITICAL] Thermal spike detected inside Server Closet.`,
          `[ALERT] Suspicious smoke/flame signature in Zone C.`,
          `[INFERENCE] Hazard: Fire detected (confidence: ${Math.floor(Math.random() * 4) + 95}%).`,
          `[ACTION] SocketIO emitting alarm trigger to monitoring dashboard.`
        ];
        newLog = `[${timestamp}] ${hazardMessages[Math.floor(Math.random() * hazardMessages.length)]}`;
        setConfidenceRate(Math.floor(Math.random() * 4) + 95);
      }

      setSimLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    }, 2800);

    return () => clearInterval(timer);
  }, [vigilantMode, simActive, projectId]);

  const handleVigilantModeChange = (mode: 'idle' | 'intruder' | 'hazard') => {
    setVigilantMode(mode);
    const timestamp = new Date().toLocaleTimeString();
    let initialLog = '';

    if (mode === 'idle') {
      initialLog = `[${timestamp}] [SYSTEM] Cleared alarm states. Scanning normal feeds...`;
      setConfidenceRate(0);
    } else if (mode === 'intruder') {
      initialLog = `[${timestamp}] [ALERT] Security breach detected! Person bounding box active.`;
      setConfidenceRate(95);
    } else if (mode === 'hazard') {
      initialLog = `[${timestamp}] [CRITICAL] Environmental hazard detected! Fire alert state: ACTIVE.`;
      setConfidenceRate(97);
    }

    setSimLogs((prev) => [initialLog, ...prev.slice(0, 5)]);
    
    if (feedScreenRef.current) {
      gsap.fromTo(feedScreenRef.current, 
        { opacity: 0.7 }, 
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  };

  // 2. RAG Chatbot Simulation Trigger
  const handleSendChat = (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const queryText = customMsg || ragQuery;
    if (!queryText.trim() || ragInferenceState !== 'idle') return;

    setRagQuery('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: queryText }]);
    setRagInferenceState('embedding');

    // Run simulated RAG chain
    setTimeout(() => {
      setRagInferenceState('retrieving');
      setTimeout(() => {
        setRagInferenceState('reranking');
        setTimeout(() => {
          setRagInferenceState('generating');
          
          let botReply = '';
          let sources: string[] = [];

          if (queryText.toLowerCase().includes('mmr') || queryText.toLowerCase().includes('max marginal')) {
            botReply = "Max Marginal Relevance (MMR) balances relevance and diversity in retrieval. It first fetches 20 candidate chunks via cosine similarity, then re-ranks them using lambda_mult=0.7: score = λ * relevance - (1-λ) * max_similarity_to_selected. This ensures the top 5 results cover different parts of multiple papers rather than being identical.";
            sources = ['mmr_algorithm.pdf', 'retrieval_config.py'];
          } else if (queryText.toLowerCase().includes('rag') || queryText.toLowerCase().includes('workflow')) {
            botReply = "Retrieval-Augmented Generation (RAG) updates LLMs with external context. First, arXiv papers are downloaded, chunked (1000 chars, 200 overlap), and stored as 384-dim vectors in ChromaDB. When queried, MMR retrieval fetches 20 candidates, selects top 5 diverse chunks, and sends them to Groq Llama 3.1 70B to write a grounded answer with citations.";
            sources = ['arxiv_rag_pipeline.pdf', 'system_flowchart.png'];
          } else if (queryText.toLowerCase().includes('accuracy') || queryText.toLowerCase().includes('secure')) {
            botReply = "We ensure accuracy using MMR retrieval (lambda_mult=0.7) to balance relevance and diversity across multiple papers. Cosine similarity scores are displayed per source. The LLM is grounded strictly in retrieved chunks — if context is insufficient, it responds with 'I could not generate a response.'";
            sources = ['rag_evaluator.py', 'retrieval_benchmarks.xlsx'];
          } else {
            botReply = "Based on my retrieved database files, this pipeline downloads 10 seminal AI/ML papers from arXiv, embeds them with all-MiniLM-L6-v2 into ChromaDB, and uses MMR search (fetch_k=20, top_k=5) before generating answers with Groq Llama 3.1 70B. The average relevance score is 0.853 with 2.4s latency.";
            sources = ['chain.py', 'evaluator.py'];
          }

          setChatMessages((prev) => [...prev, { sender: 'bot', text: botReply, sources }]);
          setRagInferenceState('idle');
        }, 800);
      }, 700);
    }, 600);
  };

  // 3. CloudAssign Simulation Trigger
  const handleFileUpload = (fileName: string) => {
    if (runnerState !== 'idle') return;
    setRunnerState('uploading');
    setUploadProgress(10);
    setRunnerLogs([`[FILE] Selected local file: ${fileName}`]);

    const progressTimer = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(progressTimer);
          triggerContainerRunner();
          return 100;
        }
        return p + 15;
      });
    }, 150);
  };

  const triggerContainerRunner = () => {
    setRunnerState('booting');
    setRunnerLogs((prev) => [...prev, '[AWS S3] Upload completed successfully.', '[DOCKER] Spawning container cpp-runner-v3...']);

    setTimeout(() => {
      setRunnerState('testing');
      setRunnerLogs((prev) => [
        ...prev, 
        '[DOCKER] Sandbox booted. Limiting memory to 50MB.', 
        '[COMPILER] Compiling main.cpp with g++...',
        '[COMPILER] Compilation SUCCESS.',
        '[TESTER] Running test suite against tests.json...'
      ]);

      setTimeout(() => {
        setRunnerState('done');
        setRunnerLogs((prev) => [
          ...prev,
          '[TESTER] Test Case 1: PASSED (0.01s)',
          '[TESTER] Test Case 2: PASSED (0.01s)',
          '[TESTER] Test Case 3: PASSED (0.02s)',
          '[TESTER] Test Case 4: PASSED (0.01s)',
          '[OK] Execution successful. Exit code: 0.',
          '----------------------------------------',
          'GRADE REPORT:',
          'Test Cases: 4 / 4 passed',
          'Performance Grade: 100/100'
        ]);
      }, 1400);
    }, 1200);
  };

  // 4. Smart Queue Simulation Trigger
  const handleRegisterToken = (vip: boolean) => {
    const nextNum = Math.floor(Math.random() * 50) + 50;
    const tokenType = vip ? 'Loans' : 'Cashier';
    const tokenId = `${vip ? 'V' : 'T'}-${nextNum}`;
    
    setTicketQueue((prev) => [...prev, { id: tokenId, vip, type: tokenType }]);
    setQueueLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Registered ${vip ? 'VIP ' : ''}Token ${tokenId} (${tokenType}).`,
      ...prev
    ]);
  };

  const handleServeNext = () => {
    if (ticketQueue.length === 0) {
      setQueueLogs((prev) => [`[${new Date().toLocaleTimeString()}] No pending tickets in queue.`, ...prev]);
      return;
    }
    // VIP first, then standard sorted by registration
    const vipIndex = ticketQueue.findIndex(t => t.vip);
    let serveIndex = vipIndex !== -1 ? vipIndex : 0;
    const token = ticketQueue[serveIndex];

    setServingToken(token.id);
    setTicketQueue((prev) => prev.filter((_, idx) => idx !== serveIndex));
    setQueueLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Desk 01 serving Token ${token.id} (${token.type}).`,
      ...prev
    ]);
  };

  // 5. Project Census Simulation Trigger
  const handleCensusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!censusName.trim() || !censusRegion.trim()) return;

    if (!networkOnline) {
      // Save offline in Room DB cache
      setLocalDatabaseRecords((prev) => prev + 1);
      setCensusSyncStatus('unsynced');
      alert(`Room SQLite: Saved household of ${censusName} locally (No network).`);
    } else {
      // Sync immediately online
      setCensusSyncStatus('syncing');
      setTimeout(() => {
        setCensusSyncStatus('synced');
        alert(`Firebase: Household data of ${censusName} synced successfully!`);
      }, 1000);
    }
    setCensusName('');
    setCensusRegion('');
  };

  const handleToggleInternet = () => {
    const nextOnline = !networkOnline;
    setNetworkOnline(nextOnline);
    if (nextOnline && censusSyncStatus === 'unsynced') {
      // Trigger WorkManager background sync simulation
      setCensusSyncStatus('syncing');
      setTimeout(() => {
        setCensusSyncStatus('synced');
        setLocalDatabaseRecords((prev) => {
          alert(`WorkManager Sync: Synchronized pending rows. 12 records updated in Firebase Firestore.`);
          return prev;
        });
      }, 1800);
    }
  };

  // 6. Library Management Console Trigger
  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;

    const command = consoleInput.trim();
    setConsoleInput('');

    let replies = [`> ${command}`];

    if (command === '1') {
      replies.push(
        'Searching Books in binary file books.dat...',
        'Hashed search lookup index loaded in 0.05ms.',
        'FOUND RECORDS:',
        '1. Book ID: 101 | Title: Object-Oriented Programming C++ | Author: Lafore | Status: AVAILABLE',
        '2. Book ID: 105 | Title: Clean Code | Author: Robert Martin | Status: ISSUED',
        'Enter Selection Code (1-4): '
      );
    } else if (command === '2') {
      replies.push(
        'Enter Book ID to issue: '
      );
    } else if (command.startsWith('10') || command === '101' || command === '105') {
      replies.push(
        'Binary fstream reading books.dat at memory address 0x7ffd...',
        'File Write Pointer Seek position: 120.',
        'Book status updated to ISSUED successfully.',
        'Enter Selection Code (1-4): '
      );
    } else if (command === '3') {
      replies.push(
        'Borrower Logs persistent cache:',
        '- ID 105 issued to Student (Sami) | Due Date: 12-Jul-2026',
        'Enter Selection Code (1-4): '
      );
    } else if (command === '4') {
      replies.push(
        'Adding Book. Enter Book details: [Format: ID, Title, Author]',
        'Example: 108, Design Patterns, Gamma'
      );
    } else if (command.includes(',')) {
      replies.push(
        'Invoking Book::createBook() constructors...',
        'fstream writing Book struct into binary file books.dat (sizeof: 108 bytes).',
        'Persistent state successfully stored.',
        'Enter Selection Code (1-4): '
      );
    } else {
      replies.push(
        'Invalid command code.',
        'Enter Selection Code (1-4): '
      );
    }

    setConsoleHistory((prev) => [...prev, ...replies]);
  };

  return (
    <div ref={containerRef} className="ptf-project-details-page">
      {/* 1. TOP HEADER & NAVIGATION */}
      <div className="ptf-project-details-header">
        <div className="container-xxl">
          <div className="ptf-spacer" style={{ height: '140px' }}></div>
          
          {/* Back button */}
          <a 
            href="#project" 
            onClick={handleBackToHome}
            className="ptf-back-btn ptf-animated-block"
            data-aos="fade-up"
            data-aos-delay="0"
          >
            <ArrowLeft size={16} />
            <span>Back to Projects</span>
          </a>

          <div className="ptf-spacer" style={{ height: '40px' }}></div>

          {/* Project Title Block */}
          <div className="ptf-project-title-row ptf-animated-block" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px' }}>
            <div style={{ flex: '1 1 500px' }}>
              <span className="ptf-project-details-category text-uppercase">
                {currentProject.category}
              </span>
              <h1 className="ptf-project-details-title has-secondary-font">
                {currentProject.title}
              </h1>
            </div>
            
            {/* Project Quick Links */}
            <div className="ptf-project-links" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <a 
                href={currentProject.repoUrl || "https://github.com/abdulsamiuthwal-eng"} 
                target="_blank" 
                rel="noreferrer" 
                className="ptf-btn-secondary"
              >
                <GithubIcon style={{ width: '18px', height: '18px' }} />
                <span>Repository</span>
              </a>
              {currentProject.liveDemoUrl && (
                <a 
                  href={currentProject.liveDemoUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="ptf-btn-primary"
                >
                  <ExternalLink size={18} />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
          
          <div className="ptf-spacer" style={{ height: '40px' }}></div>
          <div className="ptf-divider" data-aos="draw-line"></div>
        </div>
      </div>

      {/* 2. METADATA ROW / INFO CARD */}
      <div className="ptf-project-info-section">
        <div className="container-xxl">
          <div 
            className="ptf-project-meta-grid ptf-animated-block"
            data-aos="fade-up"
          >
            <div className="ptf-project-meta-item">
              <span className="meta-label">Client / Context</span>
              <span className="meta-value">{currentProject.client}</span>
            </div>
            <div className="ptf-project-meta-item">
              <span className="meta-label">Timeline</span>
              <span className="meta-value">{currentProject.timeline}</span>
            </div>
            <div className="ptf-project-meta-item">
              <span className="meta-label">Role</span>
              <span className="meta-value">{currentProject.role}</span>
            </div>
            <div className="ptf-project-meta-item">
              <span className="meta-label">Core Tech Stack</span>
              <span className="meta-value">{currentProject.techStack}</span>
            </div>
          </div>
          
          <div className="ptf-spacer" style={{ height: '20px' }}></div>
          <div className="ptf-divider" data-aos="draw-line"></div>
        </div>
      </div>

      {/* 4. DYNAMIC INTERACTIVE SIMULATOR SECTION */}
      <div className="ptf-project-simulator-section">
        <div className="container-xxl">
          <div className="ptf-spacer" style={{ height: '30px' }}></div>
          
          <div className="row align-items-center">
            {/* Description Col */}
            <div className="col-12 col-lg-5 mb-5 mb-lg-0">
              <div className="ptf-animated-block" data-aos="fade-right">
                <span className="ptf-project-details-category text-uppercase">Interactive Experience</span>
                <h3 className="section-subheading" style={{ marginBottom: '20px' }}>Live Sandbox Simulator</h3>
                <p className="narrative-para">
                  Interact directly with the system logic. Using the controls inside the console on the right, you can trigger simulations, parse code scripts, run vector database semantic scans, or queue tickets in real-time.
                </p>
                <p className="narrative-para">
                  This interactive block executes mock behaviors patterned directly after the final compiled code, highlighting system performance, operational flows, and low-latency outputs.
                </p>

                <div className="ptf-spacer" style={{ height: '20px' }}></div>

                {/* PROJECT-SPECIFIC CONTROL BOARDS */}
                
                {/* A. Vigilant Eye Control */}
                {projectId === 'vigilant-eye' && (
                  <div className="ptf-simulator-controls">
                    <div className="sim-control-header">
                      <Sliders size={16} />
                      <span>Surveillance Controls</span>
                    </div>
                    <div className="sim-control-body">
                      <div className="sim-buttons-group">
                        <button 
                          className={`sim-control-btn ${vigilantMode === 'idle' ? 'active' : ''}`}
                          onClick={() => handleVigilantModeChange('idle')}
                        >
                          <Eye size={14} />
                          <span>Scan (Idle)</span>
                        </button>
                        <button 
                          className={`sim-control-btn alert-trigger ${vigilantMode === 'intruder' ? 'active' : ''}`}
                          onClick={() => handleVigilantModeChange('intruder')}
                        >
                          <Shield size={14} />
                          <span>Intruder</span>
                        </button>
                        <button 
                          className={`sim-control-btn critical-trigger ${vigilantMode === 'hazard' ? 'active' : ''}`}
                          onClick={() => handleVigilantModeChange('hazard')}
                        >
                          <AlertTriangle size={14} />
                          <span>Fire Hazard</span>
                        </button>
                      </div>
                      <div className="sim-status-control">
                        <button onClick={() => setSimActive(!simActive)} className={`sim-toggle-play ${simActive ? 'playing' : 'paused'}`}>
                          {simActive ? <Pause size={14} /> : <Play size={14} />}
                          <span>{simActive ? 'PAUSE INF' : 'RESUME INF'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* B. RAG Chatbot Control */}
                {projectId === 'rag-chatbot' && (
                  <div className="ptf-simulator-controls">
                    <div className="sim-control-header">
                      <Sliders size={16} />
                      <span>RAG Prompts Suggestions</span>
                    </div>
                    <div className="sim-control-body">
                      <p className="narrative-para" style={{ fontSize: '13px', marginBottom: '8px' }}>Click a pre-configured prompt to query the LangChain semantic pipeline:</p>
                      <div className="sim-buttons-group" style={{ gridTemplateColumns: '1fr', gap: '8px' }}>
                        <button 
                          disabled={ragInferenceState !== 'idle'}
                          className="sim-control-btn" 
                          style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                          onClick={() => handleSendChat(undefined, "What is the RAG pipeline workflow?")}
                        >
                          <ArrowRight size={14} />
                          <span>"What is the RAG pipeline workflow?"</span>
                        </button>
                        <button 
                          disabled={ragInferenceState !== 'idle'}
                          className="sim-control-btn" 
                          style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                          onClick={() => handleSendChat(undefined, "How does MMR retrieval work?")}
                        >
                          <ArrowRight size={14} />
                          <span>"How does MMR retrieval work?"</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* C. CloudAssign Control */}
                {projectId === 'cloud-assign' && (
                  <div className="ptf-simulator-controls">
                    <div className="sim-control-header">
                      <Sliders size={16} />
                      <span>File Upload Sandbox</span>
                    </div>
                    <div className="sim-control-body">
                      <p className="narrative-para" style={{ fontSize: '13px', marginBottom: '8px' }}>Select student source script to compile inside Docker sandbox:</p>
                      <div className="sim-buttons-group" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <button 
                          disabled={runnerState !== 'idle'}
                          className="sim-control-btn"
                          onClick={() => handleFileUpload('main.cpp')}
                        >
                          <Code size={14} />
                          <span>main.cpp (C++)</span>
                        </button>
                        <button 
                          disabled={runnerState !== 'idle'}
                          className="sim-control-btn"
                          onClick={() => handleFileUpload('grader.py')}
                        >
                          <Code size={14} />
                          <span>grader.py (Python)</span>
                        </button>
                      </div>
                      {runnerState !== 'idle' && (
                        <div className="sim-status-control" style={{ flexDirection: 'column' }}>
                          <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Upload Progress: {uploadProgress}%</span>
                          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--ptf-accent-1)', transition: 'width 0.2s' }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* D. Smart Queue Control */}
                {projectId === 'smart-queue' && (
                  <div className="ptf-simulator-controls">
                    <div className="sim-control-header">
                      <Sliders size={16} />
                      <span>Queue token Operations</span>
                    </div>
                    <div className="sim-control-body">
                      <div className="sim-buttons-group">
                        <button className="sim-control-btn" onClick={() => handleRegisterToken(false)}>
                          <UserPlus size={14} />
                          <span>Register Regular</span>
                        </button>
                        <button className="sim-control-btn alert-trigger" onClick={() => handleRegisterToken(true)}>
                          <UserPlus size={14} />
                          <span>Register VIP</span>
                        </button>
                        <button className="sim-control-btn" style={{ gridColumn: 'span 3', background: '#111', color: '#fff' }} onClick={handleServeNext}>
                          <Zap size={14} style={{ color: 'var(--ptf-accent-1)' }} />
                          <span>Operator Desk: Serve Next</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* E. Project Census Control */}
                {projectId === 'project-census' && (
                  <div className="ptf-simulator-controls">
                    <div className="sim-control-header">
                      <Sliders size={16} />
                      <span>WorkManager Sync Console</span>
                    </div>
                    <div className="sim-control-body">
                      <div className="sim-buttons-group" style={{ gridTemplateColumns: '1fr' }}>
                        <button 
                          className={`sim-control-btn ${networkOnline ? 'alert-trigger active' : ''}`}
                          onClick={handleToggleInternet}
                        >
                          <Activity size={14} />
                          <span>Network Mode: {networkOnline ? 'ONLINE (Direct Sync)' : 'OFFLINE (Room Cache)'}</span>
                        </button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '8px' }}>
                        <span>Local SQLite Rows: <strong>{localDatabaseRecords}</strong></span>
                        <span>Sync status: <strong style={{ color: censusSyncStatus === 'synced' ? '#34a853' : '#e03d24' }}>{censusSyncStatus.toUpperCase()}</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* F. Library System Control */}
                {projectId === 'library-system' && (
                  <div className="ptf-simulator-controls">
                    <div className="sim-control-header">
                      <Sliders size={16} />
                      <span>Instruction Menu Shortcuts</span>
                    </div>
                    <div className="sim-control-body">
                      <div className="sim-buttons-group">
                        <button className="sim-control-btn" onClick={() => { setConsoleInput('1'); }}>
                          <span>1. Search</span>
                        </button>
                        <button className="sim-control-btn" onClick={() => { setConsoleInput('2'); }}>
                          <span>2. Borrow</span>
                        </button>
                        <button className="sim-control-btn" onClick={() => { setConsoleInput('3'); }}>
                          <span>3. Display Log</span>
                        </button>
                        <button className="sim-control-btn" style={{ gridColumn: 'span 3' }} onClick={() => { setConsoleInput('108, Design Patterns, Gamma'); }}>
                          <span>Shortcut: C++ Binary Add Struct</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Monitor Mockup Col */}
            <div className="col-12 col-lg-7 pl-lg-5">
              <div className="ptf-animated-block" data-aos="fade-left">
                <div className="ptf-monitor-mock">
                  <div className="monitor-bezel">
                    <div className="monitor-screen-inner">
                      
                      {/* DYNAMIC SCREEN INTERFACE CONTENT */}
                      
                      {/* A. Vigilant Eye Display */}
                      {projectId === 'vigilant-eye' && (
                        <>
                          <div className="monitor-header">
                            <div className="monitor-header-left">
                              <span className="live-dot animate-pulse"></span>
                              <span className="live-text">STREAM_01 // LIVE FEED</span>
                            </div>
                            <div className="monitor-header-right">
                              <span>FPS: {simActive ? '25.0' : '0.0'}</span>
                              <span>LATENCY: {simActive ? (vigilantMode === 'idle' ? '12ms' : '38ms') : '--'}</span>
                            </div>
                          </div>
                          <div ref={feedScreenRef} className="monitor-feed-area">
                            <div 
                              className="feed-scene" 
                              style={{
                                backgroundImage: vigilantMode === 'hazard' 
                                  ? `url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80')`
                                  : `url('https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80')`
                              }}
                            ></div>
                            {vigilantMode === 'intruder' && simActive && (
                              <div className="yolo-box intruder-box animate-pulse">
                                <span className="yolo-label">PERSON // CONF {confidenceRate}%</span>
                                <div className="yolo-corner tl"></div><div className="yolo-corner tr"></div><div className="yolo-corner bl"></div><div className="yolo-corner br"></div>
                              </div>
                            )}
                            {vigilantMode === 'hazard' && simActive && (
                              <div className="yolo-box hazard-box animate-pulse">
                                <span className="yolo-label">FIRE // CONF {confidenceRate}%</span>
                                <div className="yolo-corner tl"></div><div className="yolo-corner tr"></div><div className="yolo-corner bl"></div><div className="yolo-corner br"></div>
                              </div>
                            )}
                            {vigilantMode !== 'idle' && simActive && (
                              <div className={`alarm-overlay ${vigilantMode === 'hazard' ? 'hazard' : ''}`}>
                                <div className="alarm-banner">
                                  <AlertTriangle size={18} />
                                  <span>{vigilantMode === 'hazard' ? 'CRITICAL FIRE STATE' : 'BOUNDARY BREACH DETECTED'}</span>
                                </div>
                              </div>
                            )}
                            {!simActive && <div className="sim-paused-overlay"><span>INFERENCE INACTIVE</span></div>}
                          </div>
                          <div className="monitor-console">
                            <div className="console-header"><Terminal size={12} /><span>SOCKET.IO CLIENT STREAM TERMINAL</span></div>
                            <div className="console-lines">
                              {simLogs.map((log, idx) => <div key={idx} className="console-line">{log}</div>)}
                            </div>
                          </div>
                        </>
                      )}

                      {/* B. RAG Chatbot Display */}
                      {projectId === 'rag-chatbot' && (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0a0a0c' }}>
                          <div className="monitor-header">
                            <div className="monitor-header-left">
                              <span className="live-dot" style={{ background: '#0070f3' }}></span>
                              <span>LANGCHAIN RAG INTERFACE</span>
                            </div>
                            <div className="monitor-header-right">
                              <span>RETRIEVAL: {ragInferenceState.toUpperCase()}</span>
                            </div>
                          </div>
                          
                          {/* Chat Messages */}
                          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {chatMessages.map((msg, idx) => (
                              <div key={idx} style={{ 
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.sender === 'user' ? 'var(--ptf-accent-1)' : '#1a1a1f',
                                color: '#ffffff',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                maxWidth: '85%',
                                fontSize: '13px',
                                textAlign: 'left',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                              }}>
                                <div>{msg.text}</div>
                                {msg.sources && msg.sources.length > 0 && (
                                  <div style={{ marginTop: '8px', borderTop: '1px solid #333', paddingTop: '6px', fontSize: '10px', color: '#888' }}>
                                    <strong>Sources cited: </strong> {msg.sources.join(', ')}
                                  </div>
                                )}
                              </div>
                            ))}
                            {ragInferenceState !== 'idle' && (
                              <div style={{ alignSelf: 'flex-start', background: '#1a1a1f', color: '#aaa', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', fontStyle: 'italic' }}>
                                {ragInferenceState === 'embedding' && 'Embedding user query...'}
                                {ragInferenceState === 'retrieving' && 'Querying Pinecone vector indices...'}
                                {ragInferenceState === 'reranking' && 'Executing Cohere semantic re-ranking...'}
                                {ragInferenceState === 'generating' && 'GPT-4o generating answers...'}
                              </div>
                            )}
                          </div>

                          {/* Chat Input */}
                          <form onSubmit={handleSendChat} style={{ borderTop: '1px solid #1f1f23', padding: '12px', display: 'flex', gap: '8px', background: '#0e0e12' }}>
                            <input 
                              type="text" 
                              placeholder="Type query to knowledge base..." 
                              value={ragQuery}
                              onChange={(e) => setRagQuery(e.target.value)}
                              disabled={ragInferenceState !== 'idle'}
                              style={{ 
                                flex: 1, 
                                background: '#16161a', 
                                border: '1px solid #2e2e33', 
                                borderRadius: '6px', 
                                color: '#fff', 
                                padding: '8px 12px',
                                fontSize: '13px',
                                outline: 'none'
                              }}
                            />
                            <button type="submit" disabled={ragInferenceState !== 'idle'} style={{ background: 'var(--ptf-accent-1)', border: 'none', borderRadius: '6px', color: '#fff', padding: '8px 12px', cursor: 'pointer' }}>
                              <Send size={14} />
                            </button>
                          </form>
                        </div>
                      )}

                      {/* C. CloudAssign Display */}
                      {projectId === 'cloud-assign' && (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#090a0f' }}>
                          <div className="monitor-header">
                            <div className="monitor-header-left">
                              <span className="live-dot" style={{ background: '#ff9900' }}></span>
                              <span>AWS CLOUD CONTAINER RUNNER</span>
                            </div>
                            <div className="monitor-header-right">
                              <span>STATE: {runnerState.toUpperCase()}</span>
                            </div>
                          </div>
                          
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
                            {runnerState === 'idle' ? (
                              <div style={{ flex: 1, border: '2px dashed #2e2e33', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#777', gap: '15px' }}>
                                <UploadCloud size={40} />
                                <span style={{ fontSize: '13px' }}>Select C++ file in controls to trigger docker compilation</span>
                              </div>
                            ) : (
                              <div style={{ flex: 1, background: '#030408', border: '1px solid #1f2330', borderRadius: '8px', padding: '16px', overflowY: 'auto', textAlign: 'left', fontFamily: 'monospace', fontSize: '11px', color: '#52a8ff' }}>
                                {runnerLogs.map((log, idx) => (
                                  <div key={idx} style={{ 
                                    marginBottom: '4px',
                                    color: log.includes('passed') || log.includes('Grade') ? '#34a853' : log.includes('[FILE]') ? '#e2e8f0' : '#52a8ff'
                                  }}>
                                    {log}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* D. Smart Queue Display */}
                      {projectId === 'smart-queue' && (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#08080a' }}>
                          <div className="monitor-header">
                            <div className="monitor-header-left">
                              <span className="live-dot" style={{ background: '#fa4529' }}></span>
                              <span>LOBBY QUEUE MONITOR</span>
                            </div>
                            <div className="monitor-header-right">
                              <span>ACTIVE TICKET SERVER</span>
                            </div>
                          </div>

                          <div style={{ flex: 1, display: 'flex', padding: '20px', gap: '20px' }}>
                            {/* Serving Window */}
                            <div style={{ flex: 1, background: '#111', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #222' }}>
                              <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Now Serving</span>
                              <div style={{ fontSize: '56px', fontWeight: 'bold', color: 'var(--ptf-accent-1)', margin: '10px 0' }} className="animate-pulse">
                                {servingToken}
                              </div>
                              <span style={{ fontSize: '11px', background: '#fa452922', color: 'var(--ptf-accent-1)', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                                DESK 01
                              </span>
                            </div>

                            {/* Ticket Queue List */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <span style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', textAlign: 'left' }}>Waiting List ({ticketQueue.length})</span>
                              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {ticketQueue.map((t, idx) => (
                                  <div key={idx} style={{ 
                                    background: t.vip ? '#2a1a1a' : '#141416', 
                                    border: `1px solid ${t.vip ? '#fa452933' : '#222'}`, 
                                    padding: '10px', 
                                    borderRadius: '6px', 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    fontSize: '13px'
                                  }}>
                                    <strong style={{ color: t.vip ? 'var(--ptf-accent-1)' : '#fff' }}>{t.id}</strong>
                                    <span style={{ color: '#888', fontSize: '11px' }}>{t.type}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="monitor-console" style={{ height: '90px' }}>
                            <div className="console-header"><Terminal size={12} /><span>FIREBASE SERVER DATABASE OPERATIONS LOG</span></div>
                            <div className="console-lines" style={{ padding: '6px 12px' }}>
                              {queueLogs.slice(0, 3).map((log, idx) => <div key={idx} className="console-line">{log}</div>)}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* E. Project Census Display */}
                      {projectId === 'project-census' && (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0a0b10' }}>
                          <div className="monitor-header">
                            <div className="monitor-header-left">
                              <span className="live-dot" style={{ background: '#4285f4' }}></span>
                              <span>OFFLINE-FIRST SURVEY APP MOCKUP</span>
                            </div>
                            <div className="monitor-header-right">
                              <span>SQLITE PERSISTENCE</span>
                            </div>
                          </div>

                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                            {/* App Screen inside monitor */}
                            <div style={{ width: '240px', background: '#ffffff', color: '#111', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', textAlign: 'left' }}>
                              <h6 style={{ fontSize: '12px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '6px', marginBottom: '12px' }}>Household Survey Form</h6>
                              
                              <form onSubmit={handleCensusSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div>
                                  <label style={{ fontSize: '9px', color: '#888', display: 'block' }}>Name of Head</label>
                                  <input type="text" value={censusName} onChange={(e) => setCensusName(e.target.value)} placeholder="e.g. Ali Khan" style={{ width: '100%', padding: '4px 8px', fontSize: '11px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                </div>
                                <div>
                                  <label style={{ fontSize: '9px', color: '#888', display: 'block' }}>District / Region</label>
                                  <input type="text" value={censusRegion} onChange={(e) => setCensusRegion(e.target.value)} placeholder="e.g. Peshawar" style={{ width: '100%', padding: '4px 8px', fontSize: '11px', border: '1px solid #ccc', borderRadius: '4px' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                  <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '9px', color: '#888', display: 'block' }}>Members</label>
                                    <select value={censusSize} onChange={(e) => setCensusSize(e.target.value)} style={{ width: '100%', padding: '4px', fontSize: '11px', border: '1px solid #ccc', borderRadius: '4px' }}>
                                      <option>2</option><option>4</option><option>6</option><option>8</option>
                                    </select>
                                  </div>
                                </div>
                                <button type="submit" style={{ background: '#4285f4', color: '#fff', border: 'none', padding: '6px', fontSize: '11px', fontWeight: 'bold', borderRadius: '4px', marginTop: '8px', cursor: 'pointer' }}>
                                  Save Record
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* F. Library System Display */}
                      {projectId === 'library-system' && (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#030303' }}>
                          <div className="monitor-header">
                            <div className="monitor-header-left">
                              <span className="live-dot" style={{ background: '#8c8c8c' }}></span>
                              <span>C++ OBJECT BINARY IO TERMINAL</span>
                            </div>
                          </div>
                          
                          <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', background: '#000' }}>
                            <div style={{ flex: 1, overflowY: 'auto', textAlign: 'left', fontFamily: 'monospace', fontSize: '12px', color: '#00ff00', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {consoleHistory.map((line, idx) => (
                                <div key={idx}>{line}</div>
                              ))}
                            </div>

                            <form onSubmit={handleConsoleSubmit} style={{ display: 'flex', borderTop: '1px solid #333', paddingTop: '8px', marginTop: '8px' }}>
                              <span style={{ color: '#00ff00', fontFamily: 'monospace', marginRight: '8px' }}>$</span>
                              <input 
                                type="text"
                                value={consoleInput}
                                onChange={(e) => setConsoleInput(e.target.value)}
                                placeholder="Type menu selection..."
                                style={{ 
                                  flex: 1, 
                                  background: 'none', 
                                  border: 'none', 
                                  color: '#00ff00', 
                                  fontFamily: 'monospace', 
                                  fontSize: '12px',
                                  outline: 'none'
                                }}
                              />
                            </form>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                  <div className="monitor-stand"></div>
                  <div className="monitor-base"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="ptf-spacer" style={{ height: '24px' }}></div>
          <div className="ptf-divider" data-aos="draw-line"></div>
        </div>
      </div>

      {/* 5. OVERVIEW & NARRATIVE SECTION */}
      <div className="ptf-project-narrative-section">
        <div className="container-xxl">
          <div className="ptf-spacer" style={{ height: '60px' }}></div>
          
          <div className="row">
            {/* Narrative text */}
            <div className="col-12 col-md-7">
              <div className="narrative-block ptf-animated-block" data-aos="fade-up">
                <h3 className="narrative-heading text-uppercase">Project Overview</h3>
                <p className="narrative-para">{currentProject.overview}</p>
              </div>

              <div className="ptf-spacer" style={{ height: '40px' }}></div>

              <div className="narrative-block ptf-animated-block" data-aos="fade-up">
                <h3 className="narrative-heading text-uppercase">The Engineering Challenge</h3>
                <p className="narrative-para">{currentProject.challenge}</p>
              </div>
              
              <div className="ptf-spacer" style={{ height: '40px' }}></div>

              <div className="narrative-block ptf-animated-block" data-aos="fade-up">
                <h3 className="narrative-heading text-uppercase">The Implementation Solution</h3>
                <p className="narrative-para">{currentProject.solution}</p>
              </div>
            </div>

            {/* Sidebar with tech highlights & stats */}
            <div className="col-12 col-md-5 pl-md-5 mt-5 mt-md-0">
              <div 
                className="ptf-project-sidebar-card ptf-animated-block"
                data-aos="fade-up"
              >
                <h4 className="sidebar-card-title text-uppercase">Technical Highlights</h4>
                
                <ul className="sidebar-tech-list">
                  {currentProject.highlights.map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <li key={idx}>
                        <IconComp size={16} className="tech-icon" />
                        <div>
                          <strong>{item.title}</strong>
                          <span>{item.desc}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="ptf-spacer" style={{ height: '30px' }}></div>

                {/* Key metrics cards */}
                <div className="sidebar-metrics">
                  {currentProject.metrics.map((m, idx) => (
                    <div key={idx} className="metric-box">
                      <span className="metric-num">{m.num}</span>
                      <span className="metric-lbl">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="ptf-spacer" style={{ height: '24px' }}></div>
          <div className="ptf-divider" data-aos="draw-line"></div>
        </div>
      </div>

      {/* 6. TECHNICAL SHOWCASE (TABS FOR CODE / PIPELINE ARCHITECTURE) */}
      <div className="ptf-project-tech-showcase-section">
        <div className="container-xxl">
          <div className="ptf-spacer" style={{ height: '60px' }}></div>

          <h3 className="section-subheading text-center text-uppercase ptf-animated-block" data-aos="fade-up">
            Technical Implementation & Pipeline
          </h3>

          <div className="ptf-spacer" style={{ height: '30px' }}></div>

          {/* Tabs Selector */}
          <div className="ptf-showcase-tabs ptf-animated-block" data-aos="fade-up">
            <button 
              className={`ptf-tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
              onClick={() => setActiveTab('architecture')}
            >
              <Layers size={16} />
              <span>Pipeline Flowchart</span>
            </button>
            <button 
              className={`ptf-tab-btn ${activeTab === 'code' ? 'active' : ''}`}
              onClick={() => setActiveTab('code')}
            >
              <Code size={16} />
              <span>Inference Script</span>
            </button>
          </div>

          {/* Tabs Content */}
          <div className="ptf-showcase-tab-content ptf-animated-block" data-aos="fade-up">
            {activeTab === 'code' ? (
              <div className="code-editor-mock">
                <div className="editor-header">
                  <div className="editor-dots">
                    <span className="dot-red"></span>
                    <span className="dot-yellow"></span>
                    <span className="dot-green"></span>
                  </div>
                  <span className="editor-filename">
                    <Terminal size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    {currentProject.fileName}
                  </span>
                </div>
                <div className="editor-body">
                  <pre>
                    <code>{currentProject.codeSnippet}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="architecture-mock">
                <div className="arch-flow">
                  {currentProject.flowchart.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <div className="arch-step">
                        <div className="step-badge">{step.badge}</div>
                        <h5>{step.title}</h5>
                        <p>{step.desc}</p>
                      </div>
                      {idx < currentProject.flowchart.length - 1 && (
                        <div className="arch-connector">➔</div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="ptf-spacer" style={{ height: '30px' }}></div>
        </div>
      </div>

      {/* 6.5 DEDICATED SCREENSHOTS GALLERY SECTION */}
      <div className="ptf-project-gallery-section">
        <div className="container-xxl">
          <h3 className="section-subheading text-center text-uppercase ptf-animated-block" data-aos="fade-up">
            UI Screenshots & System Visuals
          </h3>
          <p className="text-center ptf-animated-block" data-aos="fade-up" style={{ color: 'var(--ptf-text-color)', marginTop: '10px' }}>
            High-fidelity interface mockups and system dashboards representing the production environment.
          </p>

          <div className="gallery-grid">
            {currentProject.screenshots.map((screen, idx) => (
              <div 
                key={idx} 
                className="gallery-card ptf-animated-block" 
                data-aos="fade-up" 
                data-aos-delay={idx * 100}
              >
                <div className="gallery-image-wrapper">
                  <img src={screen.url} alt={screen.caption} loading="lazy" decoding="async" />
                </div>
                <div className="gallery-caption">
                  {screen.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 7. CTA / NEXT NAVIGATION FOOTER */}
      <div className="ptf-project-details-footer">
        <div className="container-xxl">
          <div className="ptf-divider"></div>
          <div className="ptf-spacer" style={{ height: '50px' }}></div>
          
          <div className="row align-items-center justify-content-between">
            <a 
              href="#project" 
              onClick={handleBackToHome}
              className="footer-nav-link text-uppercase"
            >
              <ArrowLeft size={16} />
              <span>All Projects</span>
            </a>
            
            <a 
              href={`#project/${currentProject.nextProjectId}`}
              className="footer-nav-link text-uppercase next-link"
            >
              <span>Next Project</span>
              <span className="next-arrow">➔</span>
            </a>
          </div>

          <div className="ptf-spacer" style={{ height: '50px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
