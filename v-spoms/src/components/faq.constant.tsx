export type FAQ = {
  question: string;
  answer: JSX.Element;
};

export const FAQ_DATA: FAQ[] = [
  {
    question: "Website not working?",
    answer: (
      <>
        <p>
          If you found a bug with the website, please contact those responsible
          for hosting VSPOM to address the issue.
        </p>
        <p>
          However, if you are from University of Glasgow we recommend you to
          contact Dan Haydon instead.
        </p>
      </>
    ),
  },
  {
    question: "Reporting a bug",
    answer: (
      <>
        <p>
          Unfortunately the website is no longer in active development by team
          SH34. However a GitHub repository under a GNU General Public License
          has been provided with documentation supporting any potential
          development in the future. Please refer any potential bugs&nbsp;
          <a
            href="https://github.com/CS-UOG-SH34-2022/V-Spoms"
            target="_blank"
            rel="noopener"
          >
            <u>
              <i>here</i>
            </u>
          </a>
          .
        </p>
      </>
    ),
  },
  {
    question: "What file types does this website support?",
    answer: (
      <>
        <p>
          V-SPOM accepts either the .json or .CSV file types when loading a spom
          scenario. If the file is missing any required parameters they will be
          set to their respective default value. Examples can be found inside
          the example files folder&nbsp;
          <a
            href="https://github.com/CS-UOG-SH34-2022/V-Spoms"
            target="_blank"
            rel="noopener"
          >
            <u>
              <i>here</i>
            </u>
          </a>
          .
        </p>
      </>
    ),
  },
  {
    question: "Why are the graphs not loading?",
    answer: (
      <>
        <p>
          This may be due to various reasons. If a large enough network is
          provided and simulated please allow the site enough time to calculate
          the results, it is advised to run at most 1000 replicates to avoid
          encountering long wait times.
        </p>
        <p>
          Another reason could be due to the network going extinct during the
          first iteration resulting in all future results being graphed at 0, it
          is recommended to re-evaluate the function parameters and check the
          network intially contains occupied patches if this occurs. For any
          other issues please address the GitHub page&nbsp;
          <a
            href="https://github.com/CS-UOG-SH34-2022/V-Spoms"
            target="_blank"
            rel="noopener"
          >
            <u>
              <i>here</i>
            </u>
          </a>
          .
        </p>
      </>
    ),
  },
  {
    question: "Where do I provide feedback?",
    answer: (
      <>
        <p>
          All feedback is welcomed, please use the associated GitHub page&nbsp;
          <a
            href="https://github.com/CS-UOG-SH34-2022/V-Spoms"
            target="_blank"
            rel="noopener"
          >
            <u>
              <i>here</i>
            </u>
          </a>
          .
        </p>
      </>
    ),
  },
  {
    question: "A link is not working",
    answer: (
      <>
        <p>
          If one of the link is not working please comment this issue on
          GitHub&nbsp;
          <a
            href="https://github.com/CS-UOG-SH34-2022/V-Spoms"
            target="_blank"
            rel="noopener"
          >
            <u>
              <i>here</i>
            </u>
          </a>
          .
        </p>
      </>
    ),
  },
];
