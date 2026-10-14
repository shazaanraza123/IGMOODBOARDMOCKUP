import { Link, useLocation } from "react-router-dom";
import { Icon } from "./Icon";
import type { IconName } from "./iconNames";
import styles from "./TabBar.module.css";

type TabBarProps = {
  onUnavailable: () => void;
};

export function TabBar({ onUnavailable }: TabBarProps) {
  const { pathname } = useLocation();
  const homeActive = pathname === "/";
  const profileActive = !homeActive;

  return (
    <nav className={styles.bar} aria-label="Primary">
      <Link
        to="/"
        className={styles.tab}
        aria-label="Home"
        aria-current={homeActive ? "page" : undefined}
      >
        <Icon name="home" size={26} filled={homeActive} />
      </Link>
      <TabButton label="Reels" icon="reels" onPress={onUnavailable} />
      <TabButton label="Messages" icon="messages" onPress={onUnavailable} />
      <TabButton label="Search" icon="search" onPress={onUnavailable} />
      <Link
        to="/saved"
        className={styles.tab}
        aria-label="Profile"
        aria-current={profileActive ? "page" : undefined}
      >
        <span
          className={profileActive ? styles.avatarOn : styles.avatar}
          aria-hidden="true"
        />
      </Link>
    </nav>
  );
}

function TabButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: IconName;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.tab}
      aria-label={label}
      onClick={onPress}
    >
      <Icon name={icon} size={26} />
    </button>
  );
}
