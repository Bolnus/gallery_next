import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  redirect("/main/1");
}
