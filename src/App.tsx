import React, { useState, useEffect, useCallback } from 'react';
import { SportsIntro } from './components/intro/SportsIntro';
import {
  Play,
  Trophy,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Clock,
  X,
  Sparkles,
  Menu,
  Activity,
  Dumbbell,
  Target,
} from 'lucide-react';
import './App.css';

interface SportCategory {
  id: string;
  name: string;
  icon: typeof Trophy;
  facility: string;
  seasonStatus: string;
  levels: string;
  schedule: string;
  equipment: string;
  tag: string;
  squadSize: string;
}

const SPORTS_DATA: SportCategory[] = [
  {
    id: 'football',
    name: 'FOOTBALL',
    icon: Trophy,
    facility: 'Main Turf Arena (Pitch 1)',
    seasonStatus: 'Spring League • Tryouts Open',
    levels: 'Recreational • Competitive • Varsity',
    schedule: 'Mon, Wed, Fri • 17:00 - 19:30',
    equipment: 'Full match kits & training bibs provided',
    tag: '11v11 TURF LEAGUE',
    squadSize: 'Squad of 22',
  },
  {
    id: 'cricket',
    name: 'CRICKET',
    icon: Target,
    facility: 'East Cricket Ground & Practice Nets',
    seasonStatus: 'T20 Cup Series • Nets Active',
    levels: 'Beginner Nets • Club Division • Varsity XI',
    schedule: 'Tue, Thu, Sat • 16:30 - 19:00',
    equipment: 'Protective gear & match balls supplied',
    tag: 'T20 & NETS CHAMPIONSHIP',
    squadSize: 'Squad of 16',
  },
  {
    id: 'basketball',
    name: 'BASKETBALL',
    icon: Users,
    facility: 'Indoor Sports Complex (Court A)',
    seasonStatus: 'Inter-Collegiate • Varsity Prep',
    levels: 'Open Scrimmages • Men & Women Varsity',
    schedule: 'Mon, Wed, Sat • 18:00 - 20:30',
    equipment: 'Regulation hardwood courts & game balls',
    tag: '5v5 HARDWOOD ARENA',
    squadSize: 'Squad of 12',
  },
  {
    id: 'badminton',
    name: 'BADMINTON',
    icon: Calendar,
    facility: 'Racquet Sports Center (Courts 1-6)',
    seasonStatus: 'Open Singles & Doubles Ladder',
    levels: 'Social Play • Club Ranked • Varsity Squad',
    schedule: 'Tue, Thu, Sun • 17:00 - 19:30',
    equipment: 'Yonex synthetic courts & feather shuttles',
    tag: 'SINGLES & DOUBLES LADDER',
    squadSize: 'Open Division',
  },
];

export const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ignite_skip_intro_pref') !== 'true';
    }
    return true;
  });
  const [selectedSportId, setSelectedSportId] = useState<string>('football');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [preselectedSport, setPreselectedSport] = useState<string>('football');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isTransitioningIntoArena, setIsTransitioningIntoArena] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('arena');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    level: 'competitive',
  });

  // Smooth Enter Arena transition
  const handleEnterArena = useCallback(() => {
    setIsTransitioningIntoArena(true);
    setShowIntro(false);
    setTimeout(() => {
      setIsTransitioningIntoArena(false);
    }, 600);
  }, []);

  // Immediate Skip Intro (instant switch)
  const handleSkipIntro = useCallback(() => {
    setIsTransitioningIntoArena(false);
    setShowIntro(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ignite_skip_intro_pref', 'true');
    }
  }, []);

  const handleReplayIntro = useCallback(() => {
    setIsMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ignite_skip_intro_pref');
    }
    setShowIntro(true);
  }, []);

  const handleOpenJoinModal = useCallback((sportId?: string) => {
    if (sportId) {
      setPreselectedSport(sportId);
    }
    setFormSubmitted(false);
    setIsMobileMenuOpen(false);
    setIsJoinModalOpen(true);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim() && formData.studentId.trim()) {
      setFormSubmitted(true);
    }
  };

  // Keyboard accessibility for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isJoinModalOpen) {
        setIsJoinModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isJoinModalOpen]);

  // Active section scroll tracking
  useEffect(() => {
    if (showIntro) return;

    const sections = ['arena', 'disciplines', 'facilities', 'schedule'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 180;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showIntro]);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectedSport = SPORTS_DATA.find((s) => s.id === selectedSportId) || SPORTS_DATA[0];

  return (
    <div className="sports-app-root">
      {/* 3D Cinematic Multi-Sport Intro Overlay */}
      {showIntro ? (
        <div className="intro-container">
          <SportsIntro
            onEnterArena={handleEnterArena}
            onSkip={handleSkipIntro}
            clubName="IGNITE SPORTS CLUB"
            tagline="MORE THAN A GAME. WE ARE A TEAM."
          />
        </div>
      ) : (
        /* Full Functional Arena Homepage */
        <main
          className={`arena-homepage-wrapper ${
            isTransitioningIntoArena ? 'arena-fade-enter' : ''
          }`}
        >
          {/* Top Athletic Navbar */}
          <header className="arena-header">
            <div className="arena-brand" onClick={() => scrollToSection('arena')} role="button" tabIndex={0}>
              <div className="brand-crest-icon">
                <img
                  src="/ignite-logo.jpg"
                  alt="IGNITE SPORTS CLUB — EST. 2026 Logo"
                  className="brand-crest-logo-img"
                />
              </div>
              <div className="brand-title-wrap">
                <span className="brand-title">IGNITE</span>
                <span className="brand-subtitle">SPORTS CLUB • EST. 2026</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="arena-nav" aria-label="Main Navigation">
              <button
                type="button"
                className={`nav-link ${activeSection === 'arena' ? 'active' : ''}`}
                onClick={() => scrollToSection('arena')}
              >
                ARENA
              </button>
              <button
                type="button"
                className={`nav-link ${activeSection === 'disciplines' ? 'active' : ''}`}
                onClick={() => scrollToSection('disciplines')}
              >
                DISCIPLINES
              </button>
              <button
                type="button"
                className={`nav-link ${activeSection === 'facilities' ? 'active' : ''}`}
                onClick={() => scrollToSection('facilities')}
              >
                FACILITIES
              </button>
              <button
                type="button"
                className={`nav-link ${activeSection === 'schedule' ? 'active' : ''}`}
                onClick={() => scrollToSection('schedule')}
              >
                SCHEDULE
              </button>
            </nav>

            {/* Actions */}
            <div className="arena-actions">
              <button
                type="button"
                className="sports-cut-button secondary replay-intro-nav-btn"
                onClick={handleReplayIntro}
                title="Replay 3D Cinematic Sequence"
              >
                <Play size={14} />
                <span>REPLAY INTRO</span>
              </button>
              <button
                type="button"
                className="sports-cut-button primary"
                onClick={() => handleOpenJoinModal()}
              >
                <span>JOIN CLUB</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                className="mobile-menu-toggle-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </header>

          {/* Mobile Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className="mobile-nav-drawer" role="dialog" aria-modal="true">
              <div className="mobile-nav-links">
                <button
                  type="button"
                  className={`mobile-nav-link ${activeSection === 'arena' ? 'active' : ''}`}
                  onClick={() => scrollToSection('arena')}
                >
                  ARENA
                </button>
                <button
                  type="button"
                  className={`mobile-nav-link ${activeSection === 'disciplines' ? 'active' : ''}`}
                  onClick={() => scrollToSection('disciplines')}
                >
                  DISCIPLINES
                </button>
                <button
                  type="button"
                  className={`mobile-nav-link ${activeSection === 'facilities' ? 'active' : ''}`}
                  onClick={() => scrollToSection('facilities')}
                >
                  FACILITIES
                </button>
                <button
                  type="button"
                  className={`mobile-nav-link ${activeSection === 'schedule' ? 'active' : ''}`}
                  onClick={() => scrollToSection('schedule')}
                >
                  SCHEDULE
                </button>
              </div>

              <div className="mobile-nav-actions">
                <button
                  type="button"
                  className="sports-cut-button secondary"
                  onClick={handleReplayIntro}
                >
                  <Play size={16} />
                  <span>REPLAY 3D INTRO</span>
                </button>
                <button
                  type="button"
                  className="sports-cut-button primary"
                  onClick={() => handleOpenJoinModal()}
                >
                  <span>JOIN CLUB</span>
                </button>
              </div>
            </div>
          )}

          {/* Hero Section */}
          <section id="arena" className="arena-hero-section">
            <div className="hero-status-pill">
              <span className="live-pulsar" />
              SEASON 2026 TRYOUTS & CHAMPIONSHIPS ACTIVE
            </div>

            <h1 className="arena-hero-headline">
              DOMINATE THE FIELD.<br />
              <span className="electric-gradient-text">FORGE THE LEGACY.</span>
            </h1>

            <p className="arena-hero-subhead">
              The premier athletic club uniting football, cricket, basketball, and badminton under one unstoppable banner.
            </p>

            <div className="hero-cta-group">
              <button
                type="button"
                className="sports-cut-button primary"
                onClick={() => scrollToSection('disciplines')}
              >
                <span>EXPLORE TEAMS</span>
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                className="sports-cut-button secondary"
                onClick={handleReplayIntro}
              >
                <Play size={16} />
                <span>EXPERIENCE 3D INTRO</span>
              </button>
            </div>
          </section>

          {/* Sports Disciplines Section */}
          <section id="disciplines" className="arena-disciplines-section">
            <div className="section-header">
              <span className="section-kicker">ATHLETIC DISCIPLINES</span>
              <h2 className="section-title">CHOOSE YOUR SPORT</h2>
              <p className="section-subtitle">
                Select a sport to explore facility locations, weekly training sessions, and open tryouts.
              </p>
            </div>

            {/* Interactive Sports Category Cards Grid */}
            <div className="disciplines-banner-grid" role="tablist">
              {SPORTS_DATA.map((sport) => {
                const IconComponent = sport.icon;
                const isSelected = selectedSportId === sport.id;

                return (
                  <button
                    key={sport.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`discipline-item ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setSelectedSportId(sport.id)}
                  >
                    <div className="disc-header-row">
                      <div className="disc-icon-badge">
                        <IconComponent size={22} className="disc-icon" />
                      </div>
                      <span className="disc-status-tag">
                        <span className="tag-pulsar" />
                        {sport.seasonStatus.split('•')[1]?.trim() || 'ACTIVE'}
                      </span>
                    </div>

                    <div className="disc-info">
                      <strong className="disc-name">{sport.name}</strong>
                      <span className="disc-category-tag">{sport.tag}</span>
                      <span className="disc-venue">{sport.facility}</span>
                    </div>

                    <div className="disc-card-footer">
                      <div className="disc-levels-pill">{sport.squadSize}</div>
                      <span className="disc-select-prompt">
                        {isSelected ? 'ACTIVE' : 'VIEW DETAILS →'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Selected Sport Detail Panel */}
            <div className="discipline-detail-card">
              <div className="detail-header">
                <div>
                  <span className="detail-tag">ACTIVE PROGRAM OVERVIEW</span>
                  <h3 className="detail-title">{selectedSport.name} PROGRAM</h3>
                </div>
                <button
                  type="button"
                  className="sports-cut-button primary register-interest-btn"
                  onClick={() => handleOpenJoinModal(selectedSport.id)}
                >
                  <span>REGISTER FOR {selectedSport.name}</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="detail-grid">
                <div className="detail-cell">
                  <div className="cell-icon-label">
                    <MapPin size={18} color="#62C7FF" />
                    <span>TRAINING VENUE</span>
                  </div>
                  <strong>{selectedSport.facility}</strong>
                </div>

                <div className="detail-cell">
                  <div className="cell-icon-label">
                    <Clock size={18} color="#62C7FF" />
                    <span>WEEKLY SCHEDULE</span>
                  </div>
                  <strong>{selectedSport.schedule}</strong>
                </div>

                <div className="detail-cell">
                  <div className="cell-icon-label">
                    <Users size={18} color="#62C7FF" />
                    <span>SKILL DIVISIONS</span>
                  </div>
                  <strong>{selectedSport.levels}</strong>
                </div>

                <div className="detail-cell">
                  <div className="cell-icon-label">
                    <Sparkles size={18} color="#62C7FF" />
                    <span>CLUB GEAR</span>
                  </div>
                  <strong>{selectedSport.equipment}</strong>
                </div>
              </div>
            </div>
          </section>

          {/* Athletic Facilities Section */}
          <section id="facilities" className="arena-facilities-section">
            <div className="section-header">
              <span className="section-kicker">INFRASTRUCTURE</span>
              <h2 className="section-title">CAMPUS SPORTS FACILITIES</h2>
              <p className="section-subtitle">
                Tournament-ready facilities maintaining international performance benchmarks.
              </p>
            </div>

            <div className="facilities-grid">
              <div className="facility-card">
                <div className="facility-icon-wrap">
                  <Activity size={24} color="#62C7FF" />
                </div>
                <h3>OLYMPIC-STANDARD TURF ARENA</h3>
                <p>Equipped with FIFA-certified artificial turf, floodlights, and spectator seating for 1,500.</p>
                <div className="facility-badge">FOOTBALL VENUE</div>
              </div>

              <div className="facility-card">
                <div className="facility-icon-wrap">
                  <Target size={24} color="#62C7FF" />
                </div>
                <h3>VARSITY CRICKET OVAL</h3>
                <p>Natural grass wicket with 6 all-weather practice nets and automated bowling machines.</p>
                <div className="facility-badge">CRICKET VENUE</div>
              </div>

              <div className="facility-card">
                <div className="facility-icon-wrap">
                  <Dumbbell size={24} color="#62C7FF" />
                </div>
                <h3>INDOOR HARDWOOD ARENA</h3>
                <p>Shock-absorbent maple flooring, digital shot clocks, and high-intensity LED sports lighting.</p>
                <div className="facility-badge">BASKETBALL VENUE</div>
              </div>

              <div className="facility-card">
                <div className="facility-icon-wrap">
                  <Sparkles size={24} color="#62C7FF" />
                </div>
                <h3>RACQUET SPORTS PAVILION</h3>
                <p>6 international-standard court mats with non-slip coating and dedicated warm-up zones.</p>
                <div className="facility-badge">BADMINTON VENUE</div>
              </div>
            </div>
          </section>

          {/* Schedule Section */}
          <section id="schedule" className="arena-schedule-section">
            <div className="section-header">
              <span className="section-kicker">TRAINING TIMETABLE</span>
              <h2 className="section-title">WEEKLY SCHEDULE</h2>
              <p className="section-subtitle">
                View training slots and reserve your tryout orientation with the coaching staff.
              </p>
            </div>

            <div className="schedule-table-wrap">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>SPORT</th>
                    <th>DAYS</th>
                    <th>HOURS</th>
                    <th>LOCATION</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {SPORTS_DATA.map((sport) => (
                    <tr key={sport.id}>
                      <td className="sport-col">
                        <strong>{sport.name}</strong>
                      </td>
                      <td>{sport.schedule.split('•')[0]}</td>
                      <td>{sport.schedule.split('•')[1] || '17:00 - 19:30'}</td>
                      <td>{sport.facility.split('(')[0]}</td>
                      <td>
                        <button
                          type="button"
                          className="table-join-btn"
                          onClick={() => handleOpenJoinModal(sport.id)}
                        >
                          JOIN TRYOUT
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Footer */}
          <footer className="arena-footer">
            <div className="footer-content">
              <div className="footer-brand">
                <div className="brand-crest-icon">
                  <img
                    src="/ignite-logo.jpg"
                    alt="IGNITE SPORTS CLUB Logo"
                    className="brand-crest-logo-img"
                  />
                </div>
                <div className="footer-brand-text">
                  <span className="footer-brand-title">IGNITE SPORTS CLUB</span>
                  <span className="footer-brand-est">EST. 2026</span>
                </div>
              </div>
              <p className="footer-copyright">
                © 2026 IGNITE SPORTS CLUB. ALL RIGHTS RESERVED. MORE THAN A GAME. WE ARE A TEAM.
              </p>
            </div>
          </footer>

          {/* Join Club / Tryouts Modal */}
          {isJoinModalOpen && (
            <div
              className="modal-backdrop"
              role="dialog"
              aria-modal="true"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsJoinModalOpen(false);
              }}
            >
              <div className="modal-card">
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsJoinModalOpen(false)}
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>

                {!formSubmitted ? (
                  <form onSubmit={handleFormSubmit} className="join-form">
                    <div className="modal-header">
                      <span className="section-kicker">TRYOUT & MEMBERSHIP REGISTRATION</span>
                      <h3 className="modal-title">JOIN IGNITE SPORTS CLUB</h3>
                      <p className="modal-sub">
                        Register your details to attend upcoming team selections and club orientation for EST. 2026.
                      </p>
                    </div>

                    <div className="form-group">
                      <label htmlFor="student-name">FULL NAME</label>
                      <input
                        id="student-name"
                        type="text"
                        required
                        placeholder="Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="student-id">STUDENT ID</label>
                        <input
                          id="student-id"
                          type="text"
                          required
                          placeholder="e.g. ISC-2026-8941"
                          value={formData.studentId}
                          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="student-email">CAMPUS EMAIL</label>
                        <input
                          id="student-email"
                          type="email"
                          required
                          placeholder="alex@campus.edu"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="sport-select">PRIMARY SPORT</label>
                      <select
                        id="sport-select"
                        value={preselectedSport}
                        onChange={(e) => setPreselectedSport(e.target.value)}
                      >
                        <option value="football">Football</option>
                        <option value="cricket">Cricket</option>
                        <option value="basketball">Basketball</option>
                        <option value="badminton">Badminton</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="experience-level">EXPERIENCE LEVEL</label>
                      <select
                        id="experience-level"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      >
                        <option value="recreational">Recreational / Social Play</option>
                        <option value="competitive">Competitive / Club Division</option>
                        <option value="varsity">Varsity Candidate</option>
                      </select>
                    </div>

                    <button type="submit" className="sports-cut-button primary submit-reg-btn">
                      <span>CONFIRM REGISTRATION</span>
                      <ArrowRight size={18} />
                    </button>
                  </form>
                ) : (
                  <div className="form-success-box">
                    <CheckCircle2 size={54} color="#62C7FF" />
                    <h3>REGISTRATION CONFIRMED!</h3>
                    <p>
                      Welcome, <strong>{formData.name}</strong>. Your tryout slot for{' '}
                      <strong>{preselectedSport.toUpperCase()}</strong> has been submitted.
                      Check your campus email for orientation dates and equipment guidelines.
                    </p>
                    <button
                      type="button"
                      className="sports-cut-button primary"
                      onClick={() => setIsJoinModalOpen(false)}
                    >
                      <span>RETURN TO ARENA</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default App;
