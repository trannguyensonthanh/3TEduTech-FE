import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Facebook,
  FileText,
  Film,
  Filter,
  Github,
  Globe,
  HelpCircle,
  Image,
  Instagram,
  Laptop,
  Loader2,
  LucideProps,
  Menu,
  MessageCircle,
  MessageSquare,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Pizza,
  Plus,
  Search,
  Settings,
  Sparkles,
  Star,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
  Youtube,
  Zap,
  Lock,
  File,
  LayoutDashboard,
  Book,
  BookOpen,
  DollarSign,
  BarChart2,
  Edit,
  Users,
  Tag,
  Eye,
  Save,
  UploadCloud,
  Layers,
  Info,
  ArrowLeft,
  Copy,
  RefreshCw,
  Mail,
  CheckCircle,
  Linkedin,
  Calendar,
  Download,
  Share,
  Building,
  Phone,
  MapPin,
  Building2,
  Award,
  Smartphone,
  ShoppingCart,
  Play,
  Pause,
  Printer,
} from 'lucide-react';
import { Laptop as Google } from 'lucide-react';

// Define Icon type using LucideProps as the base
export type Icon = React.ForwardRefExoticComponent<
  Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
>;

export const Icons = {
  logo: Zap,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertCircle,
  user: User,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  messageSquare: MessageSquare, // Added missing icon
  moreHorizontal: MoreHorizontal, // Added missing icon
  laptop: Laptop,
  globe: Globe,
  search: Search,
  check: Check,
  menu: Menu,
  course: FileText,
  lesson: File,
  video: Film,
  clock: Clock,
  filter: Filter,
  sparkles: Sparkles,
  star: Star,
  chat: MessageCircle,
  image: Image,
  lock: Lock,
  file: File,
  dashboard: LayoutDashboard,
  book: Book,
  bookOpen: BookOpen,
  dollarSign: DollarSign,
  barChart: BarChart2,
  edit: Edit,
  users: Users,
  tag: Tag,
  eye: Eye,
  save: Save,
  upload: UploadCloud,
  layers: Layers,
  info: Info,
  plus: Plus,
  x: X,
  mail: Mail,
  copy: Copy,
  refresh: RefreshCw,
  checkCircle: CheckCircle,
  fileText: FileText,
  linkedin: Linkedin,
  calendar: Calendar,
  download: Download,
  share: Share,
  building: Building,
  mapPin: MapPin,
  phone: Phone,
  certificate: Award,
  shoppingCart: ShoppingCart,
  play: Play,
  pause: Pause,
  alertCircle: AlertCircle,
  printer: Printer,
  paypal: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className="h-4 w-4"
      {...props}
    >
      <path
        fill="currentColor"
        d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.365 2.341-1.286 3.95-2.683 5.054-1.207.95-2.748 1.453-4.558 1.56-2.99.174-3.743.329-4.628 1.716-1.01 1.587.037 3.478.037 3.478s.7.537.78.615c.27.269.351.413.253.737-.067.222-.04.29-.251.289l-2.034.017zm7.868-13.12c-.92.095-1.919.086-3.032.086h-.55l.389-2.48h.632c.913 0 1.778.008 2.242.136.81.225.751.702.7 1.006-.094.574-.296.976-.381 1.252z"
      />
    </svg>
  ),
  bitcoin: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className="h-4 w-4"
      {...props}
    >
      <path
        fill="currentColor"
        d="M11.5 11.5V4.5C11.5 3.7 12.2 3 13 3S14.5 3.7 14.5 4.5V6H16V4.5C16 2.8 14.7 1.5 13 1.5S10 2.8 10 4.5V11.5C8.8 12.3 8 13.8 8 15.5C8 18 10 20 12.5 20S17 18 17 15.5C17 13.8 16.2 12.3 15 11.5H11.5ZM12.5 18.5C10.8 18.5 9.5 17.2 9.5 15.5C9.5 13.8 10.8 12.5 12.5 12.5S15.5 13.8 15.5 15.5C15.5 17.2 14.2 18.5 12.5 18.5Z"
      />
    </svg>
  ),
  ethereum: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className="h-4 w-4"
      {...props}
    >
      <path
        fill="currentColor"
        d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"
      />
    </svg>
  ),
  apple: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className="h-4 w-4"
      {...props}
    >
      <path
        fill="currentColor"
        d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42zm2.52 7.44a4.51 4.51 0 0 1 2.16-3.81 4.66 4.66 0 0 0-3.66-2c-1.56-.16-3. .91-3.83.91s-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.92 12.29 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53s1.75-.82 3.28-.82 2 .82 3.3.79 2.22-1.23 3.06-2.45a11 11 0 0 0 1.38-2.83 4.41 4.41 0 0 1-2.68-4.06z"
      />
    </svg>
  ),
  google: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className="h-4 w-4"
      {...props}
    >
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  ),
  creditCard: CreditCard,
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  github: Github,
  youtube: Youtube,
};
