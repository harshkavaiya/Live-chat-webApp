import { useContext } from "react";
import ThemeDialog from "../components/setting/ThemeDialog";
import { MdLogout } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import useAuthStore from "../store/useAuthStore";
import useHomePageNavi from "../store/useHomePageNavi";
import { IoClose } from "react-icons/io5";

const Setting = () => {
  const icons = [
    {
      icon: MdLockOutline,
      name: "privacy",
    },
    {
      icon: MdLogout,
      name: "Logout",
    },
  ];
  const { SetActivePage } = useHomePageNavi.getState();
  const { authUser } = useAuthStore.getState();

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* setting logo */}
      <div className="p-4">
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      {/* user profile */}
      <div
        className="flex px-5 py-2 items-center cursor-pointer gap-3 hover:bg-primary/10"
        onClick={() => SetActivePage("myprofile")}
      >
        <div className="rounded-full cursor-pointer bg-primary-content overflow-hidden w-20 h-20">
          <img
            src={
              authUser?.profilePic ||
              "data:image/png;base64,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"
            }
            alt="myprofile"
            className="object-cover object-center w-full h-full"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-lg font-semibold">{authUser?.fullname}</p>
          <p className="text-sm">{authUser?.about}</p>
        </div>
      </div>

      {/* theme button */}
      <button
        className="btn mx-5 my-5"
        onClick={() => document.getElementById("theme").showModal()}
      >
        Change Theme
      </button>
      <ThemeDialog />

      {/* others options */}
      <div className="flex flex-col">
        {icons.map((i, idx) => (
          <div
            key={idx}
            className="grid grid-cols-10 cursor-pointer hover:bg-primary/10"
            onClick={() =>
              document
                .getElementById(
                  i.name == "Logout"
                    ? "logoutConfirm_modal"
                    : "PrivacyPolicy_modal"
                )
                .showModal()
            }
          >
            <span className="col-span-2 grid place-items-center">
              <i.icon
                size={22}
                className={`${i.name == "Logout" && "text-red-500"}`}
              />
            </span>
            <span className="col-span-8 border-b border-base-300 py-4">
              <p
                className={`text-[1.1rem] capitalize ${
                  i.name == "Logout" && "text-red-500"
                }`}
              >
                {i.name}
              </p>
            </span>
          </div>
        ))}
      </div>
      <LogoutConfirm />
      <PrivacyPolicy />
    </div>
  );
};

const LogoutConfirm = () => {
  const { logout } = useAuthStore();
  return (
    <dialog id="logoutConfirm_modal" className="modal z-50">
      <div className="modal-box bg-base-100 relative w-fit gap-5 p-10 flex items-center flex-col">
        <span>
          <p className="text-lg text-center font-semibold">
            Are you sure you want to Logout
          </p>
        </span>
        <div className="grid grid-cols-1 gap-3 w-full">
          <button
            className="btn btn-error disabled:cursor-not-allowed"
            onClick={logout}
          >
            "Yes, sure"
          </button>
          <button
            className="btn btn-outline"
            onClick={() => document.getElementById("logoutConfirm").close()}
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};

const PrivacyPolicy = () => {
  return (
    <dialog
      id="PrivacyPolicy_modal"
      className="modal max-w-5xl mx-auto p-6 text-gray-800"
    >
      <div className="modal-box max-w-[90%]">
        <div className="fixed top-3 right-3 cursor-pointer">
          <IoClose
            onClick={() =>
              document.getElementById("PrivacyPolicy_modal").close()
            }
            size={30}
          />
        </div>
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-600 mb-6">Last Updated: [1 Jan 2025]</p>

        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>
          Welcome to Baatcheet! Your privacy is important to us. This Privacy
          Policy explains how we collect, use, disclose, and safeguard your
          information when you use our real-time chat application.
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">
          2. Information We Collect
        </h2>
        <ul className="list-disc list-inside">
          <li>
            <strong>Personal Information:</strong> Name, email, phone number,
            and profile picture.
          </li>
          <li>
            <strong>Chat Data:</strong> Encrypted messages, voice, and video
            calls.
          </li>
          <li>
            <strong>Device Information:</strong> OS, IP address for security and
            troubleshooting.
          </li>
          <li>
            <strong>Location Data:</strong> Collected for location-based
            features (with consent).
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-4 mb-2">
          3. How We Use Your Information
        </h2>
        <ul className="list-disc list-inside">
          <li>To provide and maintain the chat services.</li>
          <li>To improve user experience and application performance.</li>
          <li>
            To ensure security, prevent fraud, and detect unauthorized access.
          </li>
          <li>
            To comply with legal obligations and enforce our Terms of Service.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-4 mb-2">4. Data Security</h2>
        <p>
          We implement industry-standard security measures, including end-to-end
          encryption for messages and calls. However, no method of transmission
          over the internet is 100% secure.
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">
          5. Sharing of Information
        </h2>
        <p>
          We do not sell or share your personal information with third parties
          except in the following cases:
        </p>
        <ul className="list-disc list-inside">
          <li>When required by law.</li>
          <li>
            With your consent for specific features (e.g., third-party
            integrations).
          </li>
          <li>To prevent fraud or security threats.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4 mb-2">
          6. Your Rights & Choices
        </h2>
        <ul className="list-disc list-inside">
          <li>
            <strong>Access & Update:</strong> You can access and update your
            profile information within the app.
          </li>
          <li>
            <strong>Delete Account:</strong> You can request account deletion by
            contacting our support team.
          </li>
          <li>
            <strong>Opt-Out:</strong> You can disable location access and
            notification preferences in your device settings.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-4 mb-2">
          7. Children's Privacy
        </h2>
        <p>
          Our service is not intended for children under 13. We do not knowingly
          collect personal data from children.
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">
          8. Changes to This Policy
        </h2>
        <p>
          We may update this policy from time to time. Any changes will be
          communicated through our app or website.
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at <strong>[BaatCheet@gmail.com]</strong>.
        </p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default Setting;
