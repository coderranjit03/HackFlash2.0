# DataFlow Frontend

A modern React-based web application for data format conversion and legacy system modernization. DataFlow provides an intuitive interface for uploading legacy data files and converting them to modern formats with visual analysis and API generation capabilities.

## 🚀 Overview

DataFlow is designed to bridge the gap between legacy data systems and modern APIs. It allows users to upload files in various legacy formats (CSV, TXT, Excel, DB2 SQL, AS/400) and convert them to modern formats (JSON, REST API, GraphQL, Modern SQL) with comprehensive visual analysis and compatibility checking.

## ✨ Key Features

- **Multi-Format Support**: Upload and convert between 5+ legacy formats and 4+ modern formats
- **Visual Data Analysis**: Side-by-side comparison of legacy vs modern data structures
- **Format Compatibility Matrix**: Intelligent format compatibility checking
- **API Generation**: Generate REST API specifications and GraphQL schemas from data
- **Dark/Light Theme**: Responsive design with theme switching
- **Real-time Processing**: Live file parsing and conversion with progress indicators
- **Data Visualization**: Charts and tables for data comparison and analysis
- **User Authentication**: Sign up/Sign in functionality with session management

## 🛠️ Technology Stack

### Core Technologies
- **React 19.1.1** - Modern React with hooks and functional components
- **Vite 7.1.6** - Fast build tool and development server
- **React Router DOM 7.9.1** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework

### UI & Visualization
- **Framer Motion 12.23.16** - Animation library for smooth transitions
- **Chart.js 4.5.0** - Data visualization and charting
- **React Chart.js 2 5.3.0** - React wrapper for Chart.js
- **TanStack React Table 8.21.3** - Powerful table component

### Development Tools
- **ESLint 9.35.0** - Code linting and formatting
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.21** - CSS vendor prefixing

## 📁 Project Structure

```
FrontEnd/
├── public/                 # Static assets
│   └── vite.svg           # Vite logo
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── DataComparison.jsx      # Data comparison visualization
│   │   ├── FileUpload.jsx          # File upload component
│   │   ├── Footer.jsx              # Application footer
│   │   ├── FormatCard.jsx          # Format selection cards
│   │   ├── FormatCompatibility.jsx # Compatibility matrix display
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── QAVisualizer.jsx        # Q&A visualization component
│   │   ├── QnACompare.jsx          # Q&A comparison component
│   │   ├── SIdebar.jsx             # Dashboard sidebar
│   │   └── StatusCard.jsx          # Status display cards
│   ├── context/          # React context providers
│   │   └── ThemeContext.jsx        # Theme management context
│   ├── data/             # Static data and configurations
│   │   ├── formatDefinitions.js   # Format definitions and compatibility
│   │   └── mock.js                 # Mock data for development
│   ├── pages/             # Main application pages
│   │   ├── ApiExplorer.jsx         # API testing and exploration
│   │   ├── DataUpload.jsx          # Main data upload and conversion page
│   │   ├── Landing.jsx             # Homepage/landing page
│   │   ├── SignIN.jsx              # User sign-in page
│   │   └── SignUp.jsx              # User registration page
│   ├── services/          # API services and external integrations
│   │   └── conversionService.js    # Data conversion service
│   ├── utils/             # Utility functions
│   │   └── fileParser.js           # File parsing utilities
│   ├── App.jsx            # Main application component
│   ├── App.css            # Global application styles
│   ├── index.css          # Base styles and Tailwind imports
│   └── main.jsx           # Application entry point
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite configuration
├── eslint.config.js       # ESLint configuration
└── postcss.config.js      # PostCSS configuration
```

## 🎯 Core Components

### Pages

#### Landing Page (`Landing.jsx`)
- Hero section with application introduction
- Feature showcase with animated cards
- Statistics section with conversion metrics
- Call-to-action buttons for sign up/sign in

#### Data Upload Page (`DataUpload.jsx`)
- File upload with drag-and-drop support
- Automatic format detection based on file extension
- Format selection with compatibility checking
- Real-time file parsing and metadata extraction
- Data conversion with progress indicators
- Side-by-side data comparison visualization

#### API Explorer (`ApiExplorer.jsx`)
- Interactive API testing interface
- Generated API endpoint testing
- Request/response visualization
- API documentation display

#### Authentication Pages (`SignIn.jsx`, `SignUp.jsx`)
- User registration and login forms
- Form validation and error handling
- Session management with localStorage

### Components

#### FileUpload (`FileUpload.jsx`)
- Drag-and-drop file upload interface
- File type validation
- Upload progress indicators
- File preview and metadata display

#### DataComparison (`DataComparison.jsx`)
- Side-by-side data structure comparison
- Chart visualizations for data analysis
- Field mapping and transformation display
- Export functionality for converted data

#### FormatCard (`FormatCard.jsx`)
- Interactive format selection cards
- Compatibility status indicators
- Format descriptions and examples
- Visual icons and color coding

#### FormatCompatibility (`FormatCompatibility.jsx`)
- Compatibility matrix visualization
- Conversion statistics and metrics
- Format usage analytics
- Interactive compatibility checking

### Services

#### Conversion Service (`conversionService.js`)
- Backend API integration for data conversion
- Mock conversion service for development
- File upload and processing
- Conversion result management

#### File Parser (`fileParser.js`)
- Multi-format file parsing (CSV, TXT, SQL, Excel, JSON)
- Automatic delimiter detection
- Metadata extraction
- Data structure analysis

## 🔧 Configuration

### Environment Setup

1. **Node.js**: Requires Node.js 16+ and npm
2. **Dependencies**: Install with `npm install`
3. **Development Server**: Run with `npm run dev`
4. **Build**: Create production build with `npm run build`

### Key Configuration Files

#### `vite.config.js`
```javascript
export default defineConfig({
  plugins: [react()],
})
```

#### `tailwind.config.js`
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 📊 Data Formats

### Supported Legacy Formats

| Format | Description | Extensions | Icon |
|--------|-------------|------------|------|
| CSV | Comma-separated values | .csv | 📄 |
| TXT | Fixed-width/pipe-delimited | .txt, .dat | 📝 |
| SQL (DB2) | DB2 schema dumps | .sql, .db2 | 🗄️ |
| TXT (AS/400) | AS/400 command scripts | .txt, .cmd, .cl | 🖥️ |
| Excel | Microsoft Excel spreadsheets | .xls, .xlsx | 📊 |

### Supported Modern Formats

| Format | Description | Extensions | Icon |
|--------|-------------|------------|------|
| JSON | JavaScript Object Notation | .json | 🔗 |
| REST API | OpenAPI/Swagger specification | .yaml, .yml, .json | 🌐 |
| Modern SQL | PostgreSQL/MySQL schema | .sql, .pgsql, .mysql | 🗃️ |
| GraphQL | GraphQL schema definition | .graphql, .gql | 🔍 |

### Format Compatibility Matrix

The application includes intelligent compatibility checking:

- **CSV** → JSON, REST API, Modern SQL, GraphQL
- **TXT** → JSON, REST API, Modern SQL
- **SQL (DB2)** → Modern SQL, REST API, GraphQL
- **TXT (AS/400)** → JSON, Modern SQL
- **Excel** → JSON, REST API, Modern SQL

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Blue-purple gradient theme with gray neutrals
- **Typography**: Clean, modern font stack with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Shadows**: Subtle shadows for depth and elevation
- **Animations**: Smooth transitions with Framer Motion

### Responsive Design
- Mobile-first approach with responsive breakpoints
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements
- Optimized for desktop and tablet usage

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators and states

## 🔐 Authentication & State Management

### User Authentication
- Local storage-based session management
- User registration and login forms
- Protected routes and navigation
- User profile management

### State Management
- React Context for theme management
- Local state with React hooks
- LocalStorage for data persistence
- Component-level state management

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DataFlow/FrontEnd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🧪 Development

### Code Structure
- Functional components with React hooks
- Custom hooks for reusable logic
- Context providers for global state
- Utility functions for data processing
- Service modules for API integration

### Best Practices
- Component composition over inheritance
- Props validation and default values
- Error boundary implementation
- Performance optimization with React.memo
- Clean code and consistent naming

### Testing Strategy
- Component testing with React Testing Library
- Integration testing for user flows
- Mock services for development
- Error handling and edge cases

## 🔄 Data Flow

1. **File Upload**: User selects file → File validation → Format detection
2. **Parsing**: File content → Parser utility → Structured data + metadata
3. **Format Selection**: Legacy format → Compatibility check → Modern format options
4. **Conversion**: Data + formats → Conversion service → Converted data
5. **Visualization**: Original + converted data → Comparison component → Charts/tables
6. **Storage**: Results → LocalStorage → Session persistence

## 🚧 Future Enhancements

### Planned Features
- Real backend API integration
- Advanced data validation
- Batch file processing
- Export functionality
- User collaboration features
- Advanced analytics dashboard
- API rate limiting
- Data encryption

### Technical Improvements
- TypeScript migration
- Unit test coverage
- Performance optimization
- SEO optimization
- PWA capabilities
- Offline functionality

## 📝 License

This project is part of the DataFlow data modernization platform. Please refer to the main project documentation for licensing information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**DataFlow Frontend** - Modernizing legacy data systems, one conversion at a time. ⚡