import React from 'react';

interface AdvantageItemProps {
  logo: string;
  value: string;
  title: string;
  delay: string;
}

const AdvantageItem: React.FC<AdvantageItemProps> = ({ logo, value, title, delay }) => {
  return (
    <div className="col-6 col-md-4 col-lg-2">
      <div 
        className="ptf-advantage-box ptf-animated-block" 
        data-aos="fade-up" 
        data-aos-delay={delay}
      >
        <div className="ptf-advantage-box__content">
          <div className="ptf-advantage-box__image">
            <img src={logo} alt={title} />
          </div>
          <div className="ptf-advantage-box__value">
            {value.endsWith('%') ? (
              <>
                {value.slice(0, -1)}
                <span className="percent-sign">%</span>
              </>
            ) : (
              value
            )}
          </div>
          <h6 className="ptf-advantage-box__title">{title}</h6>
        </div>
      </div>
    </div>
  );
};

const Skills: React.FC = () => {
  const advantages = [
    // AI/ML Core
    {
      logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg',
      value: '95%',
      title: 'Python',
      delay: '0'
    },
    {
      logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/tensorflow/tensorflow-original.svg',
      value: '78%',
      title: 'TensorFlow',
      delay: '100'
    },
    {
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg',
      value: '82%',
      title: 'Scikit-learn',
      delay: '200'
    },
    {
      logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/pandas/pandas-original.svg',
      value: '85%',
      title: 'Pandas',
      delay: '300'
    },
    {
      logo: 'https://raw.githubusercontent.com/numpy/numpy/main/branding/logo/logomark/numpylogoicon.svg',
      value: '85%',
      title: 'NumPy',
      delay: '400'
    },
    {
      logo: 'https://raw.githubusercontent.com/ultralytics/assets/main/logo/Ultralytics-logomark-color.png',
      value: '80%',
      title: 'YOLOv8',
      delay: '500'
    },
    // AI Frameworks
    {
      logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/opencv/opencv-original.svg',
      value: '79%',
      title: 'OpenCV',
      delay: '0'
    },
    {
      logo: 'https://avatars.githubusercontent.com/u/126733545?s=200&v=4',
      value: '75%',
      title: 'LangChain',
      delay: '100'
    },
    {
      logo: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
      value: '72%',
      title: 'Hugging Face',
      delay: '200'
    },
    {
      logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/fastapi/fastapi-original.svg',
      value: '76%',
      title: 'FastAPI',
      delay: '300'
    },
    // Dev & SE Tools
    {
      logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg',
      value: '70%',
      title: 'Docker',
      delay: '400'
    },
    {
      logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg',
      value: '88%',
      title: 'Git / GitHub',
      delay: '500'
    },
    // Frontend
    {
      logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg',
      value: '78%',
      title: 'React',
      delay: '0'
    },
    {
      logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg',
      value: '80%',
      title: 'JavaScript',
      delay: '100'
    },
    {
      logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg',
      value: '88%',
      title: 'C++',
      delay: '200'
    },
    // Databases
    {
      logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg',
      value: '75%',
      title: 'MySQL',
      delay: '300'
    },
    {
      logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/sqlite/sqlite-original.svg',
      value: '85%',
      title: 'SQLite',
      delay: '400'
    },
    {
      logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-original.svg',
      value: '60%',
      title: 'Firebase',
      delay: '500'
    }
  ];

  return (
    <section id="skills" className="ptf-advantage-section">
      <div className="container-xxl">
        <div className="ptf-divider" data-aos="draw-line"></div>
        <div className="ptf-spacer" style={{ height: '100px' }}></div>
        {/* Title */}
        <h2 
          className="large-heading has-secondary-font fw-normal text-center ptf-animated-block responsive-section-heading"
          data-aos="fade-up"
          style={{ marginBottom: '60px' }}
        >
          My Tech Stacks
        </h2>

        {/* Advantage Grid */}
        <div className="row">
          {advantages.map((item, idx) => (
            <AdvantageItem 
              key={idx}
              logo={item.logo}
              value={item.value}
              title={item.title}
              delay={item.delay}
            />
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="ptf-spacer" style={{ height: '100px' }}></div>
    </section>
  );
};

export default Skills;
