import React, { useState, useEffect } from 'react';

// Mock data - in the future this will be replaced with imported CSV data
const mockData = {
  occupations: [
    { name: "Software Developer", alphabeticalRank: 85, commonalityRank: 76 },
    { name: "Registered Nurse", alphabeticalRank: 72, commonalityRank: 92 },
    { name: "Financial Analyst", alphabeticalRank: 30, commonalityRank: 65 },
    { name: "Graphic Designer", alphabeticalRank: 40, commonalityRank: 58 },
    { name: "Elementary Teacher", alphabeticalRank: 25, commonalityRank: 88 },
    { name: "Marketing Manager", alphabeticalRank: 60, commonalityRank: 70 },
    { name: "Civil Engineer", alphabeticalRank: 15, commonalityRank: 62 },
    { name: "HR Specialist", alphabeticalRank: 45, commonalityRank: 67 },
    { name: "Accountant", alphabeticalRank: 5, commonalityRank: 85 },
    { name: "Chef", alphabeticalRank: 12, commonalityRank: 55 }
  ],
  majors: [
    { name: "Computer Science", alphabeticalRank: 20, commonalityRank: 85 },
    { name: "Nursing", alphabeticalRank: 65, commonalityRank: 90 },
    { name: "Finance", alphabeticalRank: 35, commonalityRank: 78 },
    { name: "Graphic Design", alphabeticalRank: 42, commonalityRank: 60 },
    { name: "Education", alphabeticalRank: 27, commonalityRank: 83 },
    { name: "Marketing", alphabeticalRank: 58, commonalityRank: 74 },
    { name: "Civil Engineering", alphabeticalRank: 15, commonalityRank: 68 },
    { name: "HR Management", alphabeticalRank: 45, commonalityRank: 65 },
    { name: "Accounting", alphabeticalRank: 3, commonalityRank: 80 },
    { name: "Psychology", alphabeticalRank: 70, commonalityRank: 92 }
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

function AlphabeticalVisualization() {
  const [dataType, setDataType] = useState('occupations');
  const [rankType, setRankType] = useState('alphabetical');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [selectedItem, setSelectedItem] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparedItems, setComparedItems] = useState([]);
  const [fieldFilter, setFieldFilter] = useState('all'); // For majors
  const [sectorFilter, setSectorFilter] = useState('all'); // For occupations
  
  // Colors for the bars
  const alphabeticalColors = ['#cce5ff', '#99caff', '#66b0ff', '#3395ff', '#007bff'];
  const commonalityColors = ['#ffcccc', '#ffb3b3', '#ff9999', '#ff8080', '#ff6666'];

  // Updated getColor function to accept a type parameter
  const getColor = (value, type = rankType) => {
    const colors = type === 'alphabetical' ? alphabeticalColors : commonalityColors;
    if (value < 20) return colors[0];
    if (value < 40) return colors[1];
    if (value < 60) return colors[2];
    if (value < 80) return colors[3];
    return colors[4];
  };

  // Filter and sort data
  let data = [...mockData[dataType]];

  // Apply filter based on data type
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
    data.sort((a, b) =>
      a[rankType === 'alphabetical' ? 'alphabeticalRank' : 'commonalityRank'] -
      b[rankType === 'alphabetical' ? 'alphabeticalRank' : 'commonalityRank']
    );
  } else if (sortOrder === 'highest') {
    data.sort((a, b) =>
      b[rankType === 'alphabetical' ? 'alphabeticalRank' : 'commonalityRank'] -
      a[rankType === 'alphabetical' ? 'alphabeticalRank' : 'commonalityRank']
    );
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

  // Clear selections when switching data types
  useEffect(() => {
    setComparedItems([]);
    setSelectedItem(null);
    // Reset filters when data type changes
    setFieldFilter('all');
    setSectorFilter('all');
  }, [dataType]);

  // Get related occupations for a major
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
      }}>Career Nomenclature Explorer</h1>
      <p style={{
        textAlign: 'center',
        marginBottom: '30px',
        color: '#666'
      }}>
        Explore how different {dataType} rank in alphabetical order and relative commonality
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
          <div style={{display: 'flex', gap: '10px'}}>
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
        
        {/* Ranking Type Section */}
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
            Ranking Type
          </label>
          <div style={{display: 'flex', gap: '10px'}}>
            <button
              onClick={() => setRankType('alphabetical')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: rankType === 'alphabetical' ? '#007bff' : '#e5e7eb',
                color: rankType === 'alphabetical' ? 'white' : '#1f2937',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Alphabetical Rank
            </button>
            <button
              onClick={() => setRankType('commonality')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: rankType === 'commonality' ? '#dc3545' : '#e5e7eb',
                color: rankType === 'commonality' ? 'white' : '#1f2937',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Commonality Rank
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
            <option value="lowest">Lowest Rank First</option>
            <option value="highest">Highest Rank First</option>
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
          <div style={{position: 'relative'}}>
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
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
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
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <label style={{fontSize: '14px', fontWeight: '500', color: '#444'}}>
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
          <div style={{fontSize: '14px', color: '#666'}}>
            Select up to 2 groups to compare ({comparedItems.length}/2)
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
            <h3 style={{marginBottom: '15px', fontWeight: 'bold', color: '#333'}}>Comparison View</h3>
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
              
              <div style={{fontWeight: '500', color: '#007bff'}}>Alphabetical Rank</div>
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
                        width: `${item.alphabeticalRank}%`,
                        backgroundColor: getColor(item.alphabeticalRank, 'alphabetical'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.alphabeticalRank > 50 ? 'white' : 'black',
                        fontWeight: '500'
                      }}
                    >
                      {item.alphabeticalRank}%
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{fontWeight: '500', color: '#dc3545', marginTop: '10px'}}>Commonality Rank</div>
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
                        width: `${item.commonalityRank}%`,
                        backgroundColor: getColor(item.commonalityRank, 'commonality'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.commonalityRank > 50 ? 'white' : 'black',
                        fontWeight: '500'
                      }}
                    >
                      {item.commonalityRank}%
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
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {data.map((item, index) => {
              const value = rankType === 'alphabetical' ? item.alphabeticalRank : item.commonalityRank;
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
                        width: `${value}%`,
                        backgroundColor: getColor(value),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '10px',
                        color: value > 50 ? 'white' : 'black',
                        fontWeight: '500',
                        fontSize: '14px',
                        transition: 'width 0.5s ease-out'
                      }}
                    >
                      {value}%
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
          <h3 style={{marginBottom: '15px', fontWeight: 'bold', color: '#333'}}>
            {selectedItem.name} Details
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{marginBottom: '10px', fontWeight: '500', color: '#007bff'}}>
                Alphabetical Rank
              </div>
              <div style={{height: '28px', backgroundColor: '#f3f4f6', borderRadius: '6px', overflow: 'hidden'}}>
                <div
                  style={{
                    height: '100%',
                    width: `${selectedItem.alphabeticalRank}%`,
                    backgroundColor: getColor(selectedItem.alphabeticalRank, 'alphabetical'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: selectedItem.alphabeticalRank > 50 ? 'white' : 'black',
                    fontWeight: '500'
                  }}
                >
                  {selectedItem.alphabeticalRank}%
                </div>
              </div>
            </div>
            
            <div>
              <div style={{marginBottom: '10px', fontWeight: '500', color: '#dc3545'}}>
                Commonality Rank
              </div>
              <div style={{height: '28px', backgroundColor: '#f3f4f6', borderRadius: '6px', overflow: 'hidden'}}>
                <div
                  style={{
                    height: '100%',
                    width: `${selectedItem.commonalityRank}%`,
                    backgroundColor: getColor(selectedItem.commonalityRank, 'commonality'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: selectedItem.commonalityRank > 50 ? 'white' : 'black',
                    fontWeight: '500'
                  }}
                >
                  {selectedItem.commonalityRank}%
                </div>
              </div>
            </div>
          </div>
          
          {dataType === 'majors' && (
            <div>
              <h4 style={{marginBottom: '10px', fontWeight: 'bold', color: '#555'}}>
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
                    <div style={{display: 'flex', gap: '15px'}}>
                      <span style={{color: '#007bff'}}>
                        Alpha: {occ.alphabeticalRank}%
                      </span>
                      <span style={{color: '#dc3545'}}>
                        Common: {occ.commonalityRank}%
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
            <h4 style={{marginBottom: '10px', fontWeight: 'bold', color: '#1e40af'}}>
              Nomenclature Analysis
            </h4>
            <p style={{marginBottom: '10px', lineHeight: '1.5', color: '#334155'}}>
              {selectedItem.alphabeticalRank > 60 ? 
                `${selectedItem.name} has a high alphabetical rank (${selectedItem.alphabeticalRank}%), appearing later in alphabetical listings than many other ${dataType}.` :
                selectedItem.alphabeticalRank > 30 ?
                  `${selectedItem.name} has a moderate alphabetical rank (${selectedItem.alphabeticalRank}%), appearing in the middle range of alphabetical listings of ${dataType}.` :
                  `${selectedItem.name} has a low alphabetical rank (${selectedItem.alphabeticalRank}%), appearing earlier in alphabetical listings than most other ${dataType}.`
              }
              
              {selectedItem.commonalityRank > 75 ? 
                ` It also has a high commonality score (${selectedItem.commonalityRank}%), indicating that this is a widely recognized term among the general population.` :
                selectedItem.commonalityRank > 50 ?
                  ` It has a moderate commonality score (${selectedItem.commonalityRank}%), indicating general recognition among the population.` :
                  ` It has a relatively low commonality score (${selectedItem.commonalityRank}%), suggesting this term may be less widely recognized by the general population.`
              }
            </p>
            <p style={{lineHeight: '1.5', color: '#334155'}}>
              {dataType === 'majors' ? 
                `When students search for information about ${selectedItem.name}, the alphabetical position may affect visibility in directory listings, course catalogs, and academic resources.` :
                `In job searches and career resources, the name "${selectedItem.name}" may appear ${selectedItem.alphabeticalRank < 40 ? 'earlier' : 'later'} in listings, which can potentially impact discovery and visibility.`}
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
        <h3 style={{fontWeight: 'bold', marginBottom: '15px', color: '#475569'}}>About This Visualization</h3>
        
        <div style={{marginBottom: '15px'}}>
          <h4 style={{fontWeight: '600', fontSize: '16px', marginBottom: '8px', color: '#334155'}}>What This Shows</h4>
          <p style={{marginBottom: '10px', lineHeight: '1.6', color: '#475569'}}>
            This tool visualizes two dimensions of career and educational nomenclature:
          </p>
          <ul style={{paddingLeft: '20px', marginBottom: '10px', lineHeight: '1.6', color: '#475569'}}>
            <li><span style={{fontWeight: '600', color: '#007bff'}}>Alphabetical Rank:</span> An index representing where the name appears in alphabetical listings relative to other options in the same category.</li>
            <li><span style={{fontWeight: '600', color: '#dc3545'}}>Commonality Rank:</span> An index showing how frequently the name appears in general usage compared to alternatives.</li>
          </ul>
        </div>
        
        <div>
          <h4 style={{fontWeight: '600', fontSize: '16px', marginBottom: '8px', color: '#334155'}}>How To Use This Tool</h4>
          <ul style={{paddingLeft: '20px', marginBottom: '10px', lineHeight: '1.6', color: '#475569'}}>
            <li>Toggle between <strong>Occupations</strong> and <strong>College Majors</strong> to explore different perspectives</li>
            <li>Use <strong>Compare Mode</strong> to directly compare up to 2 items side by side</li>
            <li>Click on any item to view detailed information and analysis</li>
            <li>For college majors, explore related occupations to understand career path implications</li>
          </ul>
          <p style={{fontSize: '14px', color: '#64748b', marginTop: '15px', fontStyle: 'italic'}}>
            Note: This visualization uses standardized rankings based on contemporary nomenclature patterns. Actual visibility and recognition may vary in different contexts.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AlphabeticalVisualization;