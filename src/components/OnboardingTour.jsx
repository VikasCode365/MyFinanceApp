

// import Joyride from 'react-joyride';

// const OnboardingTour = ({ run, setRun, isDarkMode }) => {
//   const steps = [
//     {
//       target: 'body',
//       content: 'Welcome to Monefy! Let’s take a quick tour.',
//       placement: 'center',
//       disableBeacon: true,
//     },
//     {
//       target: '.budget-selector',
//       content: 'Choose your budget period here.',
//     },
//     {
//       target: 'body',
//       content: 'We are going to Transaction Tab.',
//       placement: 'center',
//     },
//     {
//       target: '.add-transaction-btn',
//       content: 'Click to add a new transaction.',
//     },
//     {
//       target: 'body',
//       content: 'We are going to Goal Tab.',
//       placement: 'center',
//     },
//     {
//             target: '.goals-tab',
//             content: 'Track your savings goals here.',
//           },
//           {
//             target: 'body',
//             content: 'We are going to insights Tab.',
//             placement: 'center',
//           },
//     {
//             target: '.insights-tab',
//             content: 'View financial insights and tips.',
//           },
//   ];

//   return (
//     <Joyride
//       steps={steps}
//       run={run}
//       continuous
//       showProgress
//       showSkipButton
//       callback={(data) => {
//         if (['finished', 'skipped'].includes(data.status)) {
//           setRun(false); // Stop the tour
//         }
//       }}
//       styles={{
//         options: {
//           zIndex: 1000,
//           backgroundColor: isDarkMode ? '#1f2937' : '#fff',
//           textColor: isDarkMode ? '#f9fafb' : '#111827',
//           primaryColor: '#4f46e5',
//         },
//       }}
//     />
//   );
// };

// export default OnboardingTour;

import Joyride, { STATUS } from 'react-joyride';

const OnboardingTour = ({ run, setRun, isDarkMode }) => {
  const steps = [
    {
      target: '.budget-selector',
      content: 'Select your budget period (weekly, monthly, or yearly) to track your spending.',
      disableBeacon: true,
    },
    {
      target: '.add-transaction-btn',
      content: 'Click here to add a new transaction, such as an expense or income.',
    },
    {
      target: '.goals-tab',
      content: 'Create a savings goal to plan for big purchases, like concert tickets!',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false); // Stop the tour and save state
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: isDarkMode ? '#818cf8' : '#4f46e5',
          backgroundColor: isDarkMode ? '#1f2937' : '#fff',
          textColor: isDarkMode ? '#f9fafb' : '#111827',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip',
      }}
    />
  );
};

export default OnboardingTour;