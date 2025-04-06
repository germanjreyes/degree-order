import React, { useState, useEffect } from 'react';

// Mock data – in the future this will be replaced with imported CSV data
const mockData = {
  occupations: [
    { name: "Software Developer", averageCommute: 30 },
    { name: "Registered Nurse", averageCommute: 25 },
    { name: "Financial Analyst", averageCommute: 35 },
    { name: "Graphic Designer", averageCommute: 40 },
    { name: "Elementary Teacher", averageCommute: 20 },
    { name: "Marketing Manager", averageCommute: 30 },
    { name: "Civil Engineer", averageCommute: 40 },
    { name: "HR Specialist", averageCommute: 25 },
    { name: "Accountant", averageCommute: 35 },
    { name: "Chef", averageCommute: 20 }
  ],
  majors: [
    { name: "Computer Science", averageCommute: 30 },
    { name: "Nursing", averageCommute: 25 },
    { name: "Finance", averageCommute: 35 },
    { name: "Graphic Design", averageCommute: 40 },
    { name: "Education", averageCommute: 20 },
    { name: "Marketing", averageCommute: 30 },
    { name: "Civil Engineering", averageCommute: 40 },
    { name: "HR Management", averageCommute: 25 },
    { name: "Accounting", averageCommute: 35 },
    { name: "Psychology", averageCommute: 30 }
  ]
};

// Mapping majors to fields of study
const fieldsOfStudy = {
  "Engineering": ["Computer Science", "Civil Engineering"],
  "Natural Science": ["Nursing"],
  "Social Science": ["Finance", "Education", "Marketing", "HR Management", "Accounting", "Psychology"],
  "Humanities": ["Graphic Design"],
  "Languages": [] // Currently no majors assigned
};

// Mapping occupations to sectors/industries
const sectors = {
  "Healthcare": ["Registered Nurse"],
  "Technology": ["Software Developer"],
  "Business & Finance": ["Financial Analyst", "Marketing Manager", "HR Specialist", "Accountant"],
  "Education": ["Elementary Teacher"],
  "Creative & Media": ["Graphic Designer"],
  "Service": ["Chef"],
  "Manufacturing & Construction": ["Civil Engineer"],
  "Government & Public Service": [] // No matching occupations in current data
};

// Blue color scale for commute times
const commuteColors = ['#cce5ff', '#99ccff', '#66b3ff', '#3399ff', '#0073e6'];

function CommutingTimesExplorer() {
  const [dataType, setDataType] = useState('occupations');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [selectedItem, setSelectedItem] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparedItems, setComparedItems] = useState([]);
  const [fieldFilter, setFieldFilter] = useState('all'); // For majors
  const [sectorFilter, setSectorFilter] = useState('all'); // For occupations

  // Function to choose a color based on average commute value (minutes)
  const getColor = (value) => {
    if (value < 20) return commuteColors[0];
    if (value < 30) return commuteColors[1];
    if (value < 40) return commuteColors[2];
    if (value < 50) return commuteColors[3];
    return commuteColors[4];
  };

  // Filter and sort data
  let data = [...mockData[dataType]];

  // Apply filtering based on data type
  if (dataType === 'majors' && fieldFilter !== 'all') {
    data = data.filter(item => fieldsOfStudy[fieldFilter].includes(item.name));
  }
  if (dataType === 'occupations' && sectorFilter !== 'all') {
    data = data.filter(item => sectors[sectorFilter].includes(item.name));
  }

  // Apply search filter
  if (searchTerm) {
    data = data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  // Apply sorting
  if (sortOrder === 'alphabetical') {
    data.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === 'lowest') {
    data.sort((a, b) => a.averageCommute - b.averageCommute);
  } else if (sortOrder === 'highest') {
    data.sort((a, b) => b.averageCommute - a.averageCommute);
  }

  // Handle item selection
  const handleItemClick = (item) => {
    if (compareMode) {
      if (comparedItems.find(i => i.name === item.name)) {
        setComparedItems(comparedItems.filter(i => i.name !== item.name));
      } else if (comparedItems.length < 3) {
        setComparedItems([...comparedItems, item]);
      }
    } else {
      setSelectedItem(selectedItem?.name === item.name ? null : item);
    }
  };

  // Clear selections and filters when switching data types
  useEffect(() => {
    setComparedItems([]);
    setSelectedItem(null);
    setFieldFilter('all');
    setSectorFilter('all');
  }, [dataType]);

  // Get related occupations for a major (kept as before)
  const getRelatedOccupations = (majorName) => {
    const mapping = {
      "Computer Science": ["Software Developer"],
      "Nursing": ["Registered Nurse"],
      "Finance": ["Financial Analyst"],
      "Graphic Design": ["Graphic Designer"],
      "Education": ["Elementary Teacher"],
      "Marketing": ["Marketing Manager"],
      "Civil Engineering": ["Civil Engineer"],
      "HR Management": ["HR Specialist"],
      "Accounting": ["Accountant"],
      "Psychology": ["HR Specialist"]
    };

    return mockData.occupations.filter(occ => mapping[majorName] && mapping[majorName].includes(occ.name));
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333'
      }}>
        Commuting Times Explorer
      </h1>
      <p style={{
        textAlign: 'center',
        marginBottom: '30px',
        color: '#666'
      }}>
        Explore the average commuting times for different {dataType}
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {/* View By Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '10px',
            color: '#444'
          }}>
            View By
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setDataType('occupations')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: dataType === 'occupations' ? '#3b82f6' : '#e5e7eb',
                color: dataType === 'occupations' ? 'white' : '#1f2937',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Occupations
            </button>
            <button
              onClick={() => setDataType('majors')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: dataType === 'majors' ? '#3b82f6' : '#e5e7eb',
                color: dataType === 'majors' ? 'white' : '#1f2937',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              College Majors
            </button>
          </div>
        </div>

        {/* Sort By Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '10px',
            color: '#444'
          }}>
            Sort By
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="default">Default Order</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
            <option value="lowest">Lowest Commute First</option>
            <option value="highest">Highest Commute First</option>
          </select>
        </div>

        {/* Search Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '10px',
            color: '#444'
          }}>
            Search
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${dataType}...`}
              style={{
                width: '100%',
                padding: '10px 10px 10px 35px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                outline: 'none',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            <div style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }}>
              🔍
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      {dataType === 'majors' && (
        <div style={{
          marginBottom: '20px',
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '10px',
            color: '#444'
          }}>
            Filter by Field of Study
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button
              onClick={() => setFieldFilter('all')}
              style={{
                padding: '8px 12px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: fieldFilter === 'all' ? '#4b5563' : '#e5e7eb',
                color: fieldFilter === 'all' ? 'white' : '#1f2937',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              All Fields
            </button>
            {Object.keys(fieldsOfStudy).map(field => (
              <button
                key={field}
                onClick={() => setFieldFilter(field)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: fieldFilter === field ? '#4b5563' : '#e5e7eb',
                  color: fieldFilter === field ? 'white' : '#1f2937',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                {field}
              </button>
            ))}
          </div>
        </div>
      )}
      {dataType === 'occupations' && (
        <div style={{
          marginBottom: '20px',
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '10px',
            color: '#444'
          }}>
            Filter by Sector/Industry
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button
              onClick={() => setSectorFilter('all')}
              style={{
                padding: '8px 12px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: sectorFilter === 'all' ? '#4b5563' : '#e5e7eb',
                color: sectorFilter === 'all' ? 'white' : '#1f2937',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              All Sectors
            </button>
            {Object.keys(sectors).map(sector => (
              <button
                key={sector}
                onClick={() => setSectorFilter(sector)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: sectorFilter === sector ? '#4b5563' : '#e5e7eb',
                  color: sectorFilter === sector ? 'white' : '#1f2937',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comparison toggle */}
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#444' }}>
            Compare Mode
          </label>
          <div
            style={{
              width: '44px',
              height: '24px',
              backgroundColor: compareMode ? '#3b82f6' : '#e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background-color 0.2s ease'
            }}
            onClick={() => {
              const newCompareMode = !compareMode;
              setCompareMode(newCompareMode);
              setComparedItems([]);
              setSelectedItem(null);
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                backgroundColor: 'white',
                borderRadius: '50%',
                position: 'absolute',
                left: compareMode ? '22px' : '4px',
                top: '3px',
                transition: 'left 0.2s ease'
              }}
            />
          </div>
        </div>
        {compareMode && (
          <div style={{ fontSize: '14px', color: '#666' }}>
            Select up to 3 items to compare ({comparedItems.length}/3)
          </div>
        )}
      </div>

      {/* Main visualization */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        {compareMode && comparedItems.length > 1 ? (
          <div>
            <h3 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>
              Comparison View
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '10px'
            }}>
              <div></div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${comparedItems.length}, 1fr)`,
                gap: '10px',
                textAlign: 'center',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                {comparedItems.map((item, idx) => (
                  <div key={idx}>{item.name}</div>
                ))}
              </div>

              {/* Single row: Average Commute */}
              <div style={{ fontWeight: '500', color: '#374151' }}>
                Average Commute (min)
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${comparedItems.length}, 1fr)`,
                gap: '10px'
              }}>
                {comparedItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      height: '30px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${item.averageCommute * 2}%`, // scale factor for visualization
                        backgroundColor: getColor(item.averageCommute),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.averageCommute > 30 ? 'white' : 'black',
                        fontWeight: '500'
                      }}
                    >
                      {item.averageCommute} min
                    </div>
                  </div>
                ))}
              </div>

              <div></div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${comparedItems.length}, 1fr)`,
                gap: '10px',
                marginTop: '10px'
              }}>
                {comparedItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setComparedItems(comparedItems.filter(i => i.name !== item.name))}
                    style={{
                      padding: '5px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Remove
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.map((item, index) => {
              const value = item.averageCommute;
              const isSelected = selectedItem?.name === item.name || comparedItems.find(i => i.name === item.name);
              return (
                <div
                  key={index}
                  onClick={() => handleItemClick(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px',
                    borderRadius: '6px',
                    border: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: isSelected ? '#f0f9ff' : 'transparent'
                  }}
                >
                  <div style={{
                    width: '150px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: isSelected ? '600' : 'normal',
                    fontSize: '15px'
                  }}>
                    {item.name}
                  </div>
                  <div style={{
                    flex: 1,
                    height: '28px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05) inset'
                  }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${value * 2}%`,
                        backgroundColor: getColor(value),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '10px',
                        color: value > 30 ? 'white' : 'black',
                        fontWeight: '500',
                        fontSize: '14px',
                        transition: 'width 0.5s ease-out'
                      }}
                    >
                      {value} min
                    </div>
                  </div>
                  {compareMode && (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      border: '2px solid #3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSelected ? '#3b82f6' : 'white',
                      color: isSelected ? 'white' : '#3b82f6',
                      fontWeight: 'bold'
                    }}>
                      {isSelected ? '✓' : ''}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail view when an item is selected */}
      {selectedItem && !compareMode && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>
            {selectedItem.name} Details
          </h3>
          <div style={{
            marginBottom: '20px'
          }}>
            <div style={{ marginBottom: '10px', fontWeight: '500', color: '#374151' }}>
              Average Commute (min)
            </div>
            <div style={{
              height: '28px',
              backgroundColor: '#f3f4f6',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  height: '100%',
                  width: `${selectedItem.averageCommute * 2}%`,
                  backgroundColor: getColor(selectedItem.averageCommute),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: selectedItem.averageCommute > 30 ? 'white' : 'black',
                  fontWeight: '500'
                }}
              >
                {selectedItem.averageCommute} min
              </div>
            </div>
          </div>

          {dataType === 'majors' && (
            <div>
              <h4 style={{ marginBottom: '10px', fontWeight: 'bold', color: '#555' }}>
                Related Occupations
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {getRelatedOccupations(selectedItem.name).map((occ, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '6px'
                  }}>
                    <div>{occ.name}</div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <span style={{ color: '#374151' }}>
                        Commute: {occ.averageCommute} min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f0f9ff',
            borderRadius: '6px',
            border: '1px solid #bfdbfe'
          }}>
            <h4 style={{ marginBottom: '10px', fontWeight: 'bold', color: '#1e40af' }}>
              Commute Analysis
            </h4>
            <p style={{ marginBottom: '10px', lineHeight: '1.5', color: '#334155' }}>
              An average commute of {selectedItem.averageCommute} minutes suggests that individuals in this field typically spend this amount of time traveling to work.
            </p>
            <p style={{ lineHeight: '1.5', color: '#334155' }}>
              {dataType === 'majors'
                ? `Students pursuing ${selectedItem.name} might consider the location of educational institutions and local job markets when evaluating career paths.`
                : `Professionals in ${selectedItem.name} should factor in commuting times when considering job opportunities and work-life balance.`}
            </p>
          </div>
        </div>
      )}

      <div style={{
        padding: '20px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        marginTop: '20px'
      }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: '15px', color: '#475569' }}>About This Visualization</h3>
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '8px', color: '#334155' }}>What This Shows</h4>
          <p style={{ marginBottom: '10px', lineHeight: '1.6', color: '#475569' }}>
            This tool visualizes the average commuting times (in minutes) for careers and educational fields:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '10px', lineHeight: '1.6', color: '#475569' }}>
            <li><strong>Average Commute:</strong> The typical time individuals spend traveling to work or school.</li>
          </ul>
        </div>
        <div>
          <h4 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '8px', color: '#334155' }}>How To Use This Tool</h4>
          <ul style={{ paddingLeft: '20px', marginBottom: '10px', lineHeight: '1.6', color: '#475569' }}>
            <li>Toggle between <strong>Occupations</strong> and <strong>College Majors</strong> to explore different perspectives</li>
            <li>Use <strong>Compare Mode</strong> to directly compare up to 3 items side by side</li>
            <li>Click on any item to view detailed information and analysis</li>
            <li>For college majors, explore related occupations to understand career path implications</li>
          </ul>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '15px', fontStyle: 'italic' }}>
            Note: This visualization uses simulated data based on current estimates. Actual commuting times may vary.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CommutingTimesExplorer;
