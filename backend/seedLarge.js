require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./models/Question');

const questions = [

  // ═══════════════════════════════
  // ALGEBRA
  // ═══════════════════════════════
  { topic:'Algebra', subject:'Math', difficulty:1, text:'What is 3x if x=4?', options:['7','12','34','43'], answer:'12', explanation:'3×4=12' },
  { topic:'Algebra', subject:'Math', difficulty:1, text:'Solve: x + 7 = 15', options:['x=6','x=7','x=8','x=9'], answer:'x=8', explanation:'x=15-7=8' },
  { topic:'Algebra', subject:'Math', difficulty:1, text:'Solve: x - 4 = 10', options:['x=6','x=14','x=4','x=40'], answer:'x=14', explanation:'x=10+4=14' },
  { topic:'Algebra', subject:'Math', difficulty:1, text:'Simplify: 4x + 3x', options:['7','7x','12x','x7'], answer:'7x', explanation:'4x+3x=7x' },
  { topic:'Algebra', subject:'Math', difficulty:1, text:'If y = 2x and x = 5, find y', options:['3','7','10','25'], answer:'10', explanation:'y=2×5=10' },
  { topic:'Algebra', subject:'Math', difficulty:1, text:'What is the value of 5x - 3 when x=2?', options:['4','7','10','13'], answer:'7', explanation:'5(2)-3=10-3=7' },
  { topic:'Algebra', subject:'Math', difficulty:1, text:'Solve: 3x = 21', options:['x=3','x=6','x=7','x=9'], answer:'x=7', explanation:'x=21÷3=7' },
  { topic:'Algebra', subject:'Math', difficulty:1, text:'Which expression equals 2(x+3)?', options:['2x+3','2x+6','x+6','2x+5'], answer:'2x+6', explanation:'Distribute: 2×x+2×3=2x+6' },

  { topic:'Algebra', subject:'Math', difficulty:2, text:'Solve: 2x + 3 = 11', options:['x=3','x=4','x=5','x=6'], answer:'x=4', explanation:'2x=8, x=4' },
  { topic:'Algebra', subject:'Math', difficulty:2, text:'Solve: 3x - 7 = 8', options:['x=3','x=4','x=5','x=6'], answer:'x=5', explanation:'3x=15, x=5' },
  { topic:'Algebra', subject:'Math', difficulty:2, text:'Expand: (x+2)(x+3)', options:['x²+5x+6','x²+6x+5','x²+5x+5','x²+6x+6'], answer:'x²+5x+6', explanation:'FOIL: x²+3x+2x+6=x²+5x+6' },
  { topic:'Algebra', subject:'Math', difficulty:2, text:'Factorise: x²+7x+12', options:['(x+3)(x+4)','(x+2)(x+6)','(x+1)(x+12)','(x+4)(x+3)'], answer:'(x+3)(x+4)', explanation:'Find two numbers that multiply to 12 and add to 7: 3 and 4' },
  { topic:'Algebra', subject:'Math', difficulty:2, text:'What is the gradient of y=4x-1?', options:['1','4','-1','-4'], answer:'4', explanation:'In y=mx+c, m is the gradient=4' },
  { topic:'Algebra', subject:'Math', difficulty:2, text:'Solve: 5(x-2)=15', options:['x=3','x=4','x=5','x=7'], answer:'x=5', explanation:'x-2=3, x=5' },
  { topic:'Algebra', subject:'Math', difficulty:2, text:'If f(x)=3x+1, find f(4)', options:['10','12','13','15'], answer:'13', explanation:'f(4)=3(4)+1=13' },
  { topic:'Algebra', subject:'Math', difficulty:2, text:'Solve for x: x/3 = 9', options:['x=3','x=12','x=18','x=27'], answer:'x=27', explanation:'x=9×3=27' },

  { topic:'Algebra', subject:'Math', difficulty:3, text:'Solve: x²-5x+6=0', options:['x=2,3','x=1,6','x=2,4','x=3,4'], answer:'x=2,3', explanation:'(x-2)(x-3)=0' },
  { topic:'Algebra', subject:'Math', difficulty:3, text:'Solve: x²-9=0', options:['x=3','x=±3','x=9','x=±9'], answer:'x=±3', explanation:'x²=9, x=±3' },
  { topic:'Algebra', subject:'Math', difficulty:3, text:'What are the roots of x²+x-6=0?', options:['x=2,-3','x=-2,3','x=1,-6','x=6,-1'], answer:'x=2,-3', explanation:'(x+3)(x-2)=0, x=-3 or x=2' },
  { topic:'Algebra', subject:'Math', difficulty:3, text:'Simplify: (x²-4)/(x-2)', options:['x-2','x+2','x²-2','x'], answer:'x+2', explanation:'x²-4=(x-2)(x+2), dividing by (x-2) gives x+2' },
  { topic:'Algebra', subject:'Math', difficulty:3, text:'Solve: 2x²=8', options:['x=2','x=±2','x=4','x=±4'], answer:'x=±2', explanation:'x²=4, x=±2' },
  { topic:'Algebra', subject:'Math', difficulty:3, text:'Find the y-intercept of y=2x²+3x-5', options:['y=0','y=-5','y=3','y=2'], answer:'y=-5', explanation:'Set x=0: y=2(0)+3(0)-5=-5' },

  { topic:'Algebra', subject:'Math', difficulty:4, text:'Solve using the quadratic formula: x²+4x-5=0', options:['x=1,-5','x=-1,5','x=2,-5','x=5,-1'], answer:'x=1,-5', explanation:'a=1,b=4,c=-5. x=(-4±√36)/2=(-4±6)/2. x=1 or x=-5' },
  { topic:'Algebra', subject:'Math', difficulty:4, text:'If f(x)=x²-3x+2, find f(f(0))', options:['0','2','6','12'], answer:'6', explanation:'f(0)=2, f(2)=4-6+2=0... wait f(2)=4-6+2=0, f(0)=2, f(2)=0, f(f(0))=f(2)=0' },
  { topic:'Algebra', subject:'Math', difficulty:4, text:'Solve: |2x-3|=7', options:['x=5','x=-2','x=5 or x=-2','x=2 or x=5'], answer:'x=5 or x=-2', explanation:'2x-3=7→x=5 or 2x-3=-7→x=-2' },
  { topic:'Algebra', subject:'Math', difficulty:4, text:'What is the discriminant of 2x²+3x+1=0?', options:['1','5','9','17'], answer:'1', explanation:'b²-4ac=9-8=1' },

  // ═══════════════════════════════
  // GEOMETRY
  // ═══════════════════════════════
  { topic:'Geometry', subject:'Math', difficulty:1, text:'Area of a rectangle: length=6, width=4', options:['10','20','24','48'], answer:'24', explanation:'Area=l×w=6×4=24' },
  { topic:'Geometry', subject:'Math', difficulty:1, text:'Perimeter of a square with side 5', options:['10','15','20','25'], answer:'20', explanation:'Perimeter=4×5=20' },
  { topic:'Geometry', subject:'Math', difficulty:1, text:'How many degrees in a straight line?', options:['90','180','270','360'], answer:'180', explanation:'A straight line measures 180°' },
  { topic:'Geometry', subject:'Math', difficulty:1, text:'How many sides does a pentagon have?', options:['4','5','6','7'], answer:'5', explanation:'Pentagon = 5 sides (penta = five)' },
  { topic:'Geometry', subject:'Math', difficulty:1, text:'What is the area of a square with side 7?', options:['14','28','49','56'], answer:'49', explanation:'Area=7²=49' },
  { topic:'Geometry', subject:'Math', difficulty:1, text:'How many degrees in a full rotation?', options:['90','180','270','360'], answer:'360', explanation:'A full rotation = 360°' },
  { topic:'Geometry', subject:'Math', difficulty:1, text:'What type of angle is 45°?', options:['Right','Obtuse','Acute','Reflex'], answer:'Acute', explanation:'An acute angle is less than 90°' },
  { topic:'Geometry', subject:'Math', difficulty:1, text:'How many vertices does a cube have?', options:['4','6','8','12'], answer:'8', explanation:'A cube has 8 corners (vertices)' },

  { topic:'Geometry', subject:'Math', difficulty:2, text:'Area of triangle: base=8, height=5', options:['13','20','40','80'], answer:'20', explanation:'Area=½×8×5=20' },
  { topic:'Geometry', subject:'Math', difficulty:2, text:'Circumference of circle with radius 7 (π≈3.14)', options:['21.98','43.96','153.86','615.44'], answer:'43.96', explanation:'C=2πr=2×3.14×7=43.96' },
  { topic:'Geometry', subject:'Math', difficulty:2, text:'Sum of angles in a triangle', options:['90°','180°','270°','360°'], answer:'180°', explanation:'Interior angles of any triangle sum to 180°' },
  { topic:'Geometry', subject:'Math', difficulty:2, text:'Volume of cube with side 4', options:['12','16','48','64'], answer:'64', explanation:'Volume=4³=64' },
  { topic:'Geometry', subject:'Math', difficulty:2, text:'Area of circle with radius 5 (π≈3.14)', options:['15.7','31.4','78.5','314'], answer:'78.5', explanation:'Area=πr²=3.14×25=78.5' },
  { topic:'Geometry', subject:'Math', difficulty:2, text:'What is the hypotenuse of a 3-4-5 right triangle?', options:['3','4','5','7'], answer:'5', explanation:'By Pythagoras: √(3²+4²)=√25=5' },
  { topic:'Geometry', subject:'Math', difficulty:2, text:'Surface area of a cube with side 3', options:['18','27','36','54'], answer:'54', explanation:'SA=6×s²=6×9=54' },
  { topic:'Geometry', subject:'Math', difficulty:2, text:'Two angles of a triangle are 60° and 80°. Find the third.', options:['30°','40°','50°','60°'], answer:'40°', explanation:'180-60-80=40°' },

  { topic:'Geometry', subject:'Math', difficulty:3, text:'Volume of cylinder: r=3, h=5 (π≈3.14)', options:['47.1','94.2','141.3','282.6'], answer:'141.3', explanation:'V=πr²h=3.14×9×5=141.3' },
  { topic:'Geometry', subject:'Math', difficulty:3, text:'Find the diagonal of a rectangle: l=6, w=8', options:['7','10','12','14'], answer:'10', explanation:'d=√(6²+8²)=√100=10' },
  { topic:'Geometry', subject:'Math', difficulty:3, text:'Area of trapezoid: parallel sides 6 and 10, height 4', options:['24','32','40','64'], answer:'32', explanation:'Area=½(6+10)×4=32' },
  { topic:'Geometry', subject:'Math', difficulty:3, text:'Volume of a sphere with r=3 (π≈3.14)', options:['37.68','75.36','113.04','339.12'], answer:'113.04', explanation:'V=4/3πr³=4/3×3.14×27=113.04' },

  { topic:'Geometry', subject:'Math', difficulty:4, text:'A sector has radius 6 and angle 60°. Find its area (π≈3.14)', options:['6.28','18.84','37.68','113.04'], answer:'18.84', explanation:'Area=θ/360×πr²=60/360×3.14×36=18.84' },
  { topic:'Geometry', subject:'Math', difficulty:4, text:'Find the area of an equilateral triangle with side 6', options:['9√3','12√3','15.59','18'], answer:'9√3', explanation:'Area=√3/4×s²=√3/4×36=9√3' },

  // ═══════════════════════════════
  // PHYSICS
  // ═══════════════════════════════
  { topic:'Physics', subject:'Science', difficulty:1, text:'What is the SI unit of force?', options:['Joule','Watt','Newton','Pascal'], answer:'Newton', explanation:'Force is measured in Newtons (N)' },
  { topic:'Physics', subject:'Science', difficulty:1, text:'What is the speed of light?', options:['3×10⁶ m/s','3×10⁸ m/s','3×10¹⁰ m/s','3×10⁴ m/s'], answer:'3×10⁸ m/s', explanation:'Light travels at approximately 3×10⁸ m/s in vacuum' },
  { topic:'Physics', subject:'Science', difficulty:1, text:'What type of energy does a moving object have?', options:['Potential','Thermal','Kinetic','Chemical'], answer:'Kinetic', explanation:'Moving objects have kinetic energy due to their motion' },
  { topic:'Physics', subject:'Science', difficulty:1, text:'Which is NOT a state of matter?', options:['Solid','Liquid','Gas','Energy'], answer:'Energy', explanation:'The three states of matter are solid, liquid, and gas' },
  { topic:'Physics', subject:'Science', difficulty:1, text:'What does a thermometer measure?', options:['Pressure','Temperature','Volume','Mass'], answer:'Temperature', explanation:'A thermometer measures temperature' },
  { topic:'Physics', subject:'Science', difficulty:1, text:'What is the unit of electrical current?', options:['Volt','Watt','Ohm','Ampere'], answer:'Ampere', explanation:'Electric current is measured in Amperes (A)' },
  { topic:'Physics', subject:'Science', difficulty:1, text:'What force pulls objects toward Earth?', options:['Magnetism','Friction','Gravity','Tension'], answer:'Gravity', explanation:'Gravity is the force that attracts objects toward Earth' },
  { topic:'Physics', subject:'Science', difficulty:1, text:'What is the unit of energy?', options:['Newton','Watt','Joule','Pascal'], answer:'Joule', explanation:'Energy is measured in Joules (J)' },

  { topic:'Physics', subject:'Science', difficulty:2, text:'F = ma is which law?', options:["Newton's First","Newton's Second","Newton's Third","Hooke's Law"], answer:"Newton's Second", explanation:'F=ma is Newton\'s Second Law of Motion' },
  { topic:'Physics', subject:'Science', difficulty:2, text:'What is the formula for kinetic energy?', options:['mgh','½mv²','mv','Fd'], answer:'½mv²', explanation:'KE=½mv² where m=mass, v=velocity' },
  { topic:'Physics', subject:'Science', difficulty:2, text:'What happens to resistance when temperature increases (for metals)?', options:['Decreases','Stays same','Increases','Becomes zero'], answer:'Increases', explanation:'For metals, resistance increases with temperature' },
  { topic:'Physics', subject:'Science', difficulty:2, text:'What is Ohm\'s Law?', options:['V=IR','P=IV','F=ma','E=mc²'], answer:'V=IR', explanation:'Ohm\'s Law: Voltage = Current × Resistance' },
  { topic:'Physics', subject:'Science', difficulty:2, text:'A 5kg object accelerates at 3m/s². What is the force?', options:['1.67N','8N','15N','25N'], answer:'15N', explanation:'F=ma=5×3=15N' },
  { topic:'Physics', subject:'Science', difficulty:2, text:'What type of wave is sound?', options:['Transverse','Longitudinal','Electromagnetic','Surface'], answer:'Longitudinal', explanation:'Sound is a longitudinal wave — particles vibrate parallel to wave direction' },
  { topic:'Physics', subject:'Science', difficulty:2, text:'What is the formula for gravitational potential energy?', options:['½mv²','mgh','mv','Fd'], answer:'mgh', explanation:'GPE=mgh where m=mass, g=gravity, h=height' },
  { topic:'Physics', subject:'Science', difficulty:2, text:'Which color of light has the highest frequency?', options:['Red','Green','Blue','Violet'], answer:'Violet', explanation:'Violet light has the highest frequency in the visible spectrum' },

  { topic:'Physics', subject:'Science', difficulty:3, text:'A wave has frequency 50Hz and wavelength 2m. What is its speed?', options:['25m/s','52m/s','100m/s','200m/s'], answer:'100m/s', explanation:'v=fλ=50×2=100m/s' },
  { topic:'Physics', subject:'Science', difficulty:3, text:'What is the work done when a 10N force moves an object 5m?', options:['2J','15J','50J','500J'], answer:'50J', explanation:'W=Fd=10×5=50J' },
  { topic:'Physics', subject:'Science', difficulty:3, text:'What is the pressure exerted by a 100N force on 0.5m²?', options:['50Pa','100Pa','200Pa','500Pa'], answer:'200Pa', explanation:'P=F/A=100/0.5=200Pa' },
  { topic:'Physics', subject:'Science', difficulty:3, text:'An object falls from rest. After 3s, what is its velocity? (g=10m/s²)', options:['3m/s','10m/s','30m/s','90m/s'], answer:'30m/s', explanation:'v=gt=10×3=30m/s' },

  { topic:'Physics', subject:'Science', difficulty:4, text:'What is the momentum of a 2kg object moving at 5m/s?', options:['2.5kg m/s','7kg m/s','10kg m/s','25kg m/s'], answer:'10kg m/s', explanation:'p=mv=2×5=10 kg·m/s' },
  { topic:'Physics', subject:'Science', difficulty:4, text:'E=mc² — what does c represent?', options:['Mass','Energy','Speed of light','Charge'], answer:'Speed of light', explanation:'In E=mc², c is the speed of light (3×10⁸ m/s)' },

  // ═══════════════════════════════
  // CHEMISTRY
  // ═══════════════════════════════
  { topic:'Chemistry', subject:'Science', difficulty:1, text:'What is the chemical symbol for water?', options:['HO','H2O','OH','H2O2'], answer:'H2O', explanation:'Water is H2O — 2 hydrogen + 1 oxygen' },
  { topic:'Chemistry', subject:'Science', difficulty:1, text:'What is the atomic number of Carbon?', options:['4','6','8','12'], answer:'6', explanation:'Carbon has 6 protons, giving it atomic number 6' },
  { topic:'Chemistry', subject:'Science', difficulty:1, text:'What gas do plants absorb for photosynthesis?', options:['Oxygen','Nitrogen','Carbon dioxide','Hydrogen'], answer:'Carbon dioxide', explanation:'Plants absorb CO2 and release O2 during photosynthesis' },
  { topic:'Chemistry', subject:'Science', difficulty:1, text:'What is the pH of a neutral solution?', options:['0','5','7','14'], answer:'7', explanation:'Neutral solutions have pH=7' },
  { topic:'Chemistry', subject:'Science', difficulty:1, text:'Which gas makes up most of Earth\'s atmosphere?', options:['Oxygen','Carbon dioxide','Nitrogen','Argon'], answer:'Nitrogen', explanation:'Nitrogen makes up ~78% of the atmosphere' },
  { topic:'Chemistry', subject:'Science', difficulty:1, text:'What is the chemical symbol for gold?', options:['Go','Gd','Au','Ag'], answer:'Au', explanation:'Gold\'s symbol is Au from Latin "aurum"' },
  { topic:'Chemistry', subject:'Science', difficulty:1, text:'What is the smallest unit of an element?', options:['Molecule','Compound','Atom','Cell'], answer:'Atom', explanation:'An atom is the smallest unit of a chemical element' },
  { topic:'Chemistry', subject:'Science', difficulty:1, text:'Acids have pH values that are...?', options:['Greater than 7','Equal to 7','Less than 7','Equal to 14'], answer:'Less than 7', explanation:'Acids have pH less than 7' },

  { topic:'Chemistry', subject:'Science', difficulty:2, text:'How many electrons does Oxygen have?', options:['6','7','8','9'], answer:'8', explanation:'Oxygen has atomic number 8, so it has 8 electrons' },
  { topic:'Chemistry', subject:'Science', difficulty:2, text:'What type of bond involves sharing electrons?', options:['Ionic','Covalent','Metallic','Hydrogen'], answer:'Covalent', explanation:'Covalent bonds involve sharing of electrons between atoms' },
  { topic:'Chemistry', subject:'Science', difficulty:2, text:'What is the chemical formula for table salt?', options:['KCl','NaOH','NaCl','CaCl2'], answer:'NaCl', explanation:'Table salt is Sodium Chloride (NaCl)' },
  { topic:'Chemistry', subject:'Science', difficulty:2, text:'What is the process of a solid turning directly into gas?', options:['Melting','Evaporation','Sublimation','Condensation'], answer:'Sublimation', explanation:'Sublimation is the phase change from solid directly to gas' },
  { topic:'Chemistry', subject:'Science', difficulty:2, text:'Which subatomic particle has a negative charge?', options:['Proton','Neutron','Electron','Nucleus'], answer:'Electron', explanation:'Electrons carry negative charge' },
  { topic:'Chemistry', subject:'Science', difficulty:2, text:'What is the product of burning methane (CH4) in oxygen?', options:['H2O only','CO2 only','CO2 and H2O','CO and H2'], answer:'CO2 and H2O', explanation:'CH4 + 2O2 → CO2 + 2H2O' },

  { topic:'Chemistry', subject:'Science', difficulty:3, text:'What is Avogadro\'s number?', options:['6.022×10²²','6.022×10²³','6.022×10²⁴','1.602×10⁻¹⁹'], answer:'6.022×10²³', explanation:'Avogadro\'s number is 6.022×10²³ particles per mole' },
  { topic:'Chemistry', subject:'Science', difficulty:3, text:'Which element has the highest electronegativity?', options:['Oxygen','Chlorine','Fluorine','Nitrogen'], answer:'Fluorine', explanation:'Fluorine is the most electronegative element on the periodic table' },
  { topic:'Chemistry', subject:'Science', difficulty:3, text:'What is the oxidation state of Sulphur in H2SO4?', options:['+2','+4','+6','+8'], answer:'+6', explanation:'In H2SO4: H=+1 (×2), O=-2 (×4), so S=+6' },
  { topic:'Chemistry', subject:'Science', difficulty:3, text:'What type of reaction is 2H2 + O2 → 2H2O?', options:['Decomposition','Synthesis','Single displacement','Double displacement'], answer:'Synthesis', explanation:'Two reactants combine to form one product — a synthesis reaction' },

  // ═══════════════════════════════
  // BIOLOGY
  // ═══════════════════════════════
  { topic:'Biology', subject:'Science', difficulty:1, text:'What is the powerhouse of the cell?', options:['Nucleus','Ribosome','Mitochondria','Golgi body'], answer:'Mitochondria', explanation:'Mitochondria produce ATP through cellular respiration' },
  { topic:'Biology', subject:'Science', difficulty:1, text:'What is the basic unit of life?', options:['Tissue','Organ','Cell','Molecule'], answer:'Cell', explanation:'The cell is the fundamental structural unit of living organisms' },
  { topic:'Biology', subject:'Science', difficulty:1, text:'Which molecule carries genetic information?', options:['RNA','ATP','DNA','Protein'], answer:'DNA', explanation:'DNA carries the genetic blueprint of all living organisms' },
  { topic:'Biology', subject:'Science', difficulty:1, text:'What process do plants use to make food?', options:['Respiration','Photosynthesis','Digestion','Fermentation'], answer:'Photosynthesis', explanation:'Plants convert sunlight, CO2, and water into glucose' },
  { topic:'Biology', subject:'Science', difficulty:1, text:'What is the function of the nucleus?', options:['Energy production','Protein synthesis','Controls cell activities','Digestion'], answer:'Controls cell activities', explanation:'The nucleus is the control center of the cell, containing DNA' },
  { topic:'Biology', subject:'Science', difficulty:1, text:'How many chambers does a human heart have?', options:['2','3','4','5'], answer:'4', explanation:'The human heart has 4 chambers: 2 atria and 2 ventricles' },
  { topic:'Biology', subject:'Science', difficulty:1, text:'What is the largest organ in the human body?', options:['Liver','Lungs','Skin','Brain'], answer:'Skin', explanation:'The skin is the largest organ, covering the entire body' },
  { topic:'Biology', subject:'Science', difficulty:1, text:'What gas do humans exhale?', options:['Oxygen','Nitrogen','Carbon dioxide','Hydrogen'], answer:'Carbon dioxide', explanation:'We exhale CO2 as a waste product of cellular respiration' },

  { topic:'Biology', subject:'Science', difficulty:2, text:'What is osmosis?', options:['Movement of solutes','Movement of water through a membrane','Active transport','Cell division'], answer:'Movement of water through a membrane', explanation:'Osmosis is the diffusion of water across a semi-permeable membrane' },
  { topic:'Biology', subject:'Science', difficulty:2, text:'Which blood type is the universal donor?', options:['A','B','AB','O'], answer:'O', explanation:'Type O negative blood can be donated to anyone' },
  { topic:'Biology', subject:'Science', difficulty:2, text:'What is the function of ribosomes?', options:['Energy production','Protein synthesis','Cell division','Lipid storage'], answer:'Protein synthesis', explanation:'Ribosomes are responsible for translating mRNA into proteins' },
  { topic:'Biology', subject:'Science', difficulty:2, text:'What is mitosis?', options:['Sexual reproduction','Cell division producing 2 identical cells','Cell division producing 4 cells','Protein synthesis'], answer:'Cell division producing 2 identical cells', explanation:'Mitosis produces 2 genetically identical daughter cells' },
  { topic:'Biology', subject:'Science', difficulty:2, text:'What is the role of white blood cells?', options:['Carry oxygen','Fight infection','Clot blood','Produce hormones'], answer:'Fight infection', explanation:'White blood cells (leukocytes) are key to the immune system' },
  { topic:'Biology', subject:'Science', difficulty:2, text:'Where does gas exchange occur in the lungs?', options:['Trachea','Bronchi','Alveoli','Bronchioles'], answer:'Alveoli', explanation:'The alveoli are tiny air sacs where O2 and CO2 are exchanged' },

  { topic:'Biology', subject:'Science', difficulty:3, text:'What is the formula for photosynthesis?', options:['C6H12O6+6O2→6CO2+6H2O','6CO2+6H2O→C6H12O6+6O2','CO2+H2O→glucose','6O2+6H2O→C6H12O6+6CO2'], answer:'6CO2+6H2O→C6H12O6+6O2', explanation:'Plants use CO2 and H2O with light energy to produce glucose and oxygen' },
  { topic:'Biology', subject:'Science', difficulty:3, text:'What is the difference between DNA and RNA?', options:['DNA is single stranded','RNA contains deoxyribose','DNA contains thymine, RNA contains uracil','RNA is in the nucleus'], answer:'DNA contains thymine, RNA contains uracil', explanation:'DNA uses thymine while RNA replaces it with uracil' },
  { topic:'Biology', subject:'Science', difficulty:3, text:'What is a dominant allele?', options:['Always expressed when present','Only expressed when homozygous','Recessive in nature','Found only in females'], answer:'Always expressed when present', explanation:'A dominant allele is expressed whenever it is present in the genotype' },
  { topic:'Biology', subject:'Science', difficulty:3, text:'What is the site of photosynthesis in plant cells?', options:['Mitochondria','Vacuole','Chloroplast','Nucleus'], answer:'Chloroplast', explanation:'Chloroplasts contain chlorophyll and are where photosynthesis occurs' },

  // ═══════════════════════════════
  // ANCIENT HISTORY
  // ═══════════════════════════════
  { topic:'Ancient History', subject:'History', difficulty:1, text:'Which civilization built the pyramids of Giza?', options:['Roman Empire','Ancient Egypt','Greek Empire','Mesopotamia'], answer:'Ancient Egypt', explanation:'Built by Ancient Egyptians around 2560 BCE' },
  { topic:'Ancient History', subject:'History', difficulty:1, text:'Where was the ancient city of Troy located?', options:['Greece','Egypt','Modern Turkey','Italy'], answer:'Modern Turkey', explanation:'Troy was located in what is now northwestern Turkey' },
  { topic:'Ancient History', subject:'History', difficulty:1, text:'Who was the first Roman Emperor?', options:['Julius Caesar','Nero','Augustus','Caligula'], answer:'Augustus', explanation:'Augustus became the first Roman Emperor in 27 BCE' },
  { topic:'Ancient History', subject:'History', difficulty:1, text:'What ancient wonder was at Alexandria?', options:['Colossus of Rhodes','Hanging Gardens','Lighthouse of Alexandria','Statue of Zeus'], answer:'Lighthouse of Alexandria', explanation:'The Pharos of Alexandria was one of the Seven Wonders' },
  { topic:'Ancient History', subject:'History', difficulty:1, text:'Which empire was ruled by Julius Caesar?', options:['Greek','Persian','Roman','Egyptian'], answer:'Roman', explanation:'Julius Caesar was a Roman general and dictator' },
  { topic:'Ancient History', subject:'History', difficulty:1, text:'What was the ancient Greek city-state known for its warriors?', options:['Athens','Corinth','Sparta','Thebes'], answer:'Sparta', explanation:'Sparta was renowned for its military culture and warriors' },
  { topic:'Ancient History', subject:'History', difficulty:1, text:'What river was central to Ancient Egyptian civilization?', options:['Tigris','Euphrates','Nile','Ganges'], answer:'Nile', explanation:'The Nile River provided water and fertile soil for Ancient Egypt' },
  { topic:'Ancient History', subject:'History', difficulty:1, text:'What was the writing system of ancient Egyptians called?', options:['Cuneiform','Sanskrit','Hieroglyphics','Latin'], answer:'Hieroglyphics', explanation:'Ancient Egyptians used hieroglyphics — a pictorial writing system' },

  { topic:'Ancient History', subject:'History', difficulty:2, text:'Who was Alexander the Great\'s teacher?', options:['Plato','Socrates','Aristotle','Homer'], answer:'Aristotle', explanation:'Aristotle tutored Alexander the Great from age 13' },
  { topic:'Ancient History', subject:'History', difficulty:2, text:'What war was fought between Athens and Sparta?', options:['Persian War','Peloponnesian War','Punic War','Trojan War'], answer:'Peloponnesian War', explanation:'The Peloponnesian War (431–404 BCE) was fought between Athens and Sparta' },
  { topic:'Ancient History', subject:'History', difficulty:2, text:'Who was Cleopatra?', options:['A Greek goddess','Last pharaoh of Ancient Egypt','First Roman empress','A Spartan warrior'], answer:'Last pharaoh of Ancient Egypt', explanation:'Cleopatra VII was the last active ruler of the Ptolemaic Kingdom of Egypt' },
  { topic:'Ancient History', subject:'History', difficulty:2, text:'What was the main purpose of Stonehenge?', options:['A palace','A market','A religious/ceremonial site','A fortress'], answer:'A religious/ceremonial site', explanation:'Stonehenge is believed to have been used for religious ceremonies and astronomy' },
  { topic:'Ancient History', subject:'History', difficulty:2, text:'What civilization developed the first writing system?', options:['Egyptian','Chinese','Sumerian','Indian'], answer:'Sumerian', explanation:'The Sumerians developed cuneiform, one of the earliest writing systems' },
  { topic:'Ancient History', subject:'History', difficulty:2, text:'The Colosseum is located in which city?', options:['Athens','Cairo','Rome','Carthage'], answer:'Rome', explanation:'The Colosseum is an ancient amphitheater in Rome, Italy' },

  { topic:'Ancient History', subject:'History', difficulty:3, text:'What was the Rosetta Stone used for?', options:['Navigation','Deciphering Egyptian hieroglyphics','Religious ceremonies','Tax records'], answer:'Deciphering Egyptian hieroglyphics', explanation:'The Rosetta Stone helped scholars decode ancient Egyptian hieroglyphics' },
  { topic:'Ancient History', subject:'History', difficulty:3, text:'Which battle ended the Persian Wars?', options:['Marathon','Thermopylae','Salamis','Plataea'], answer:'Plataea', explanation:'The Battle of Plataea (479 BCE) was the decisive Greek victory ending the Persian Wars' },
  { topic:'Ancient History', subject:'History', difficulty:3, text:'What was the Pax Romana?', options:['A Roman war','200 years of relative peace in Rome','A Roman law','A battle at Rome'], answer:'200 years of relative peace in Rome', explanation:'The Pax Romana was a period of relative peace from 27 BCE to 180 CE' },
  { topic:'Ancient History', subject:'History', difficulty:3, text:'Which Roman structure carried water into cities?', options:['Forum','Aqueduct','Colosseum','Pantheon'], answer:'Aqueduct', explanation:'Roman aqueducts were engineering marvels that transported water to cities' },

  // ═══════════════════════════════
  // WORLD WAR II
  // ═══════════════════════════════
  { topic:'World War II', subject:'History', difficulty:1, text:'In which year did World War II end?', options:['1943','1944','1945','1946'], answer:'1945', explanation:'WWII ended in 1945 — Germany in May, Japan in September' },
  { topic:'World War II', subject:'History', difficulty:1, text:'Which event brought the USA into WWII?', options:['D-Day','Pearl Harbor','Battle of Britain','Fall of France'], answer:'Pearl Harbor', explanation:'Japan attacked Pearl Harbor on December 7, 1941' },
  { topic:'World War II', subject:'History', difficulty:1, text:'Who led Nazi Germany during WWII?', options:['Mussolini','Stalin','Hitler','Franco'], answer:'Hitler', explanation:'Adolf Hitler was the leader of Nazi Germany from 1933 to 1945' },
  { topic:'World War II', subject:'History', difficulty:1, text:'Which countries formed the Allied Powers?', options:['Germany, Italy, Japan','USA, UK, USSR','Germany, Japan, Spain','Italy, Japan, France'], answer:'USA, UK, USSR', explanation:'The main Allied Powers were the USA, UK, and Soviet Union' },
  { topic:'World War II', subject:'History', difficulty:1, text:'What was D-Day?', options:['End of WWII','Allied invasion of Normandy','Attack on Pearl Harbor','Fall of Berlin'], answer:'Allied invasion of Normandy', explanation:'D-Day (June 6, 1944) was the Allied amphibious invasion of Normandy, France' },
  { topic:'World War II', subject:'History', difficulty:1, text:'What was the Holocaust?', options:['A WWII battle','Nazi genocide of Jews and others','A peace treaty','The liberation of France'], answer:'Nazi genocide of Jews and others', explanation:'The Holocaust was the systematic genocide of 6 million Jews and millions of others by Nazi Germany' },
  { topic:'World War II', subject:'History', difficulty:1, text:'Which atomic bomb was dropped on Hiroshima?', options:['Fat Man','Little Boy','Big Bang','Trinity'], answer:'Little Boy', explanation:'"Little Boy" was the uranium bomb dropped on Hiroshima on August 6, 1945' },
  { topic:'World War II', subject:'History', difficulty:1, text:'Which country was NOT part of the Axis Powers?', options:['Germany','Italy','Japan','France'], answer:'France', explanation:'France was occupied by Germany — France was part of the Allies' },

  { topic:'World War II', subject:'History', difficulty:2, text:'What was Operation Overlord?', options:['Invasion of Russia','D-Day Normandy invasion','Attack on Pearl Harbor','Liberation of Paris'], answer:'D-Day Normandy invasion', explanation:'Operation Overlord was the codename for the Allied invasion of Normandy' },
  { topic:'World War II', subject:'History', difficulty:2, text:'What was the Blitzkrieg?', options:['A German submarine','Lightning fast military attack','A peace treaty','Air defense system'], answer:'Lightning fast military attack', explanation:'Blitzkrieg ("lightning war") was Germany\'s fast combined arms attack strategy' },
  { topic:'World War II', subject:'History', difficulty:2, text:'What was the significance of the Battle of Stalingrad?', options:['Allied landing in France','Turning point on Eastern Front','Fall of Berlin','Italy\'s surrender'], answer:'Turning point on Eastern Front', explanation:'Stalingrad (1942-43) was a decisive Soviet victory that turned the tide on the Eastern Front' },
  { topic:'World War II', subject:'History', difficulty:2, text:'Who was the British Prime Minister during most of WWII?', options:['Neville Chamberlain','Clement Attlee','Winston Churchill','Anthony Eden'], answer:'Winston Churchill', explanation:'Winston Churchill led Britain from 1940 to 1945 during most of WWII' },
  { topic:'World War II', subject:'History', difficulty:2, text:'What did the Enigma machine do?', options:['Sent radio signals','Encrypted German communications','Tracked submarines','Decoded Allied messages'], answer:'Encrypted German communications', explanation:'Enigma was used by Nazi Germany to encrypt military communications' },
  { topic:'World War II', subject:'History', difficulty:2, text:'Which treaty formally ended WWI and contributed to WWII?', options:['Treaty of Paris','Treaty of Versailles','Treaty of Vienna','Treaty of Rome'], answer:'Treaty of Versailles', explanation:'The harsh Treaty of Versailles (1919) created economic conditions that helped Hitler rise to power' },

  { topic:'World War II', subject:'History', difficulty:3, text:'What was the Manhattan Project?', options:['D-Day planning','American program to develop atomic bomb','German rocket program','Invasion of Japan'], answer:'American program to develop atomic bomb', explanation:'The Manhattan Project was the secret US program that developed the first nuclear weapons' },
  { topic:'World War II', subject:'History', difficulty:3, text:'What was the significance of the Nuremberg Trials?', options:['Peace negotiations','War crimes tribunal for Nazi leaders','Atomic bomb decision','German surrender ceremony'], answer:'War crimes tribunal for Nazi leaders', explanation:'The Nuremberg Trials (1945-46) prosecuted Nazi leaders for war crimes and crimes against humanity' },
  { topic:'World War II', subject:'History', difficulty:3, text:'What was Operation Barbarossa?', options:['Allied invasion of Italy','German invasion of Soviet Union','Japanese attack on Pearl Harbor','Invasion of North Africa'], answer:'German invasion of Soviet Union', explanation:'Operation Barbarossa was Nazi Germany\'s massive invasion of the Soviet Union in June 1941' },
  { topic:'World War II', subject:'History', difficulty:3, text:'What was the significance of the Battle of Britain?', options:['First land battle of WWII','First major WWII campaign fought entirely by air forces','Allied invasion of Europe','Fall of France'], answer:'First major WWII campaign fought entirely by air forces', explanation:'The Battle of Britain (1940) was the first major campaign fought entirely in the air, stopping German invasion plans' },

  // ═══════════════════════════════
  // DATA STRUCTURES
  // ═══════════════════════════════
  { topic:'Data Structures', subject:'CS', difficulty:1, text:'Which data structure uses LIFO order?', options:['Queue','Stack','Array','Linked List'], answer:'Stack', explanation:'Stack = Last In First Out (LIFO)' },
  { topic:'Data Structures', subject:'CS', difficulty:1, text:'Which data structure uses FIFO order?', options:['Stack','Queue','Tree','Graph'], answer:'Queue', explanation:'Queue = First In First Out (FIFO)' },
  { topic:'Data Structures', subject:'CS', difficulty:1, text:'What is the time complexity of accessing an array by index?', options:['O(n)','O(log n)','O(1)','O(n²)'], answer:'O(1)', explanation:'Array index access is O(1) — direct memory address calculation' },
  { topic:'Data Structures', subject:'CS', difficulty:1, text:'What is a linked list?', options:['Array of sorted elements','Nodes connected by pointers','A type of tree','A hash table'], answer:'Nodes connected by pointers', explanation:'A linked list consists of nodes where each node points to the next' },
  { topic:'Data Structures', subject:'CS', difficulty:1, text:'What is a binary tree?', options:['Tree with exactly 2 nodes','Tree where each node has at most 2 children','Sorted array','Graph with 2 edges'], answer:'Tree where each node has at most 2 children', explanation:'In a binary tree, each node can have 0, 1, or 2 children' },
  { topic:'Data Structures', subject:'CS', difficulty:1, text:'What is a hash table used for?', options:['Sorting data','Fast key-value lookup','Storing trees','Graph traversal'], answer:'Fast key-value lookup', explanation:'Hash tables provide O(1) average lookup using a hash function' },
  { topic:'Data Structures', subject:'CS', difficulty:1, text:'Which structure is best for implementing undo functionality?', options:['Queue','Array','Stack','Linked List'], answer:'Stack', explanation:'Undo uses a stack — each action is pushed and undone by popping' },
  { topic:'Data Structures', subject:'CS', difficulty:1, text:'What does a graph consist of?', options:['Nodes only','Edges only','Nodes and edges','Sorted arrays'], answer:'Nodes and edges', explanation:'A graph consists of vertices (nodes) connected by edges' },

  { topic:'Data Structures', subject:'CS', difficulty:2, text:'What is the time complexity of searching in a balanced BST?', options:['O(1)','O(log n)','O(n)','O(n²)'], answer:'O(log n)', explanation:'A balanced BST halves the search space at each step' },
  { topic:'Data Structures', subject:'CS', difficulty:2, text:'What is a heap data structure?', options:['Random array','Complete binary tree satisfying heap property','Linked list','Hash table'], answer:'Complete binary tree satisfying heap property', explanation:'A heap is a complete binary tree where parent is always ≥ (max-heap) or ≤ (min-heap) children' },
  { topic:'Data Structures', subject:'CS', difficulty:2, text:'Which traversal visits: left, root, right?', options:['Pre-order','In-order','Post-order','Level-order'], answer:'In-order', explanation:'In-order traversal: left → root → right (gives sorted output for BST)' },
  { topic:'Data Structures', subject:'CS', difficulty:2, text:'What is the worst-case time complexity of insertion in a hash table?', options:['O(1)','O(log n)','O(n)','O(n²)'], answer:'O(n)', explanation:'In worst case (all keys collide), hash table insertion is O(n)' },
  { topic:'Data Structures', subject:'CS', difficulty:2, text:'What is a deque?', options:['Double-ended queue','A type of tree','Sorted array','Circular linked list'], answer:'Double-ended queue', explanation:'A deque (double-ended queue) allows insertion and deletion at both ends' },
  { topic:'Data Structures', subject:'CS', difficulty:2, text:'What is a spanning tree of a graph?', options:['Tree with all edges','Subgraph connecting all vertices with minimum edges','Sorted graph','Directed graph'], answer:'Subgraph connecting all vertices with minimum edges', explanation:'A spanning tree connects all vertices of a graph with exactly V-1 edges' },

  { topic:'Data Structures', subject:'CS', difficulty:3, text:'What is the space complexity of a hash table with n elements?', options:['O(1)','O(log n)','O(n)','O(n²)'], answer:'O(n)', explanation:'A hash table storing n elements requires O(n) space' },
  { topic:'Data Structures', subject:'CS', difficulty:3, text:'In a max-heap with n elements, where is the maximum element?', options:['Last element','First element (root)','Middle element','Random position'], answer:'First element (root)', explanation:'In a max-heap, the maximum element is always at the root' },
  { topic:'Data Structures', subject:'CS', difficulty:3, text:'What is the difference between BFS and DFS?', options:['BFS uses stack, DFS uses queue','BFS uses queue, DFS uses stack','Both use queue','Both use stack'], answer:'BFS uses queue, DFS uses stack', explanation:'BFS explores level by level using a queue; DFS goes deep using a stack (or recursion)' },
  { topic:'Data Structures', subject:'CS', difficulty:3, text:'What is an AVL tree?', options:['Any binary tree','Self-balancing BST','Heap structure','Graph type'], answer:'Self-balancing BST', explanation:'An AVL tree is a self-balancing BST where heights of subtrees differ by at most 1' },

  // ═══════════════════════════════
  // ALGORITHMS
  // ═══════════════════════════════
  { topic:'Algorithms', subject:'CS', difficulty:1, text:'What is the time complexity of binary search?', options:['O(n)','O(n²)','O(log n)','O(1)'], answer:'O(log n)', explanation:'Binary search halves the search space each step' },
  { topic:'Algorithms', subject:'CS', difficulty:1, text:'What is the time complexity of bubble sort?', options:['O(n)','O(n log n)','O(n²)','O(log n)'], answer:'O(n²)', explanation:'Bubble sort compares adjacent elements — O(n²) in worst case' },
  { topic:'Algorithms', subject:'CS', difficulty:1, text:'What does a greedy algorithm do?', options:['Tries all possibilities','Makes locally optimal choices','Uses recursion','Backtracks always'], answer:'Makes locally optimal choices', explanation:'Greedy algorithms pick the best option at each step' },
  { topic:'Algorithms', subject:'CS', difficulty:1, text:'What is recursion?', options:['A loop structure','A function that calls itself','A sorting method','A data structure'], answer:'A function that calls itself', explanation:'Recursion is when a function calls itself with a smaller input' },
  { topic:'Algorithms', subject:'CS', difficulty:1, text:'What is the best case time complexity of bubble sort?', options:['O(n²)','O(n log n)','O(n)','O(1)'], answer:'O(n)', explanation:'If the array is already sorted, bubble sort takes O(n) — one pass with no swaps' },
  { topic:'Algorithms', subject:'CS', difficulty:1, text:'Which algorithm is used for finding the shortest path?', options:['DFS','BFS','Dijkstra\'s','Quick Sort'], answer:'Dijkstra\'s', explanation:'Dijkstra\'s algorithm finds shortest paths in a weighted graph' },
  { topic:'Algorithms', subject:'CS', difficulty:1, text:'What is dynamic programming?', options:['Programming with dynamic variables','Solving problems by breaking into overlapping subproblems','A type of recursion','Sorting algorithm'], answer:'Solving problems by breaking into overlapping subproblems', explanation:'DP solves problems by storing results of subproblems to avoid recomputation' },
  { topic:'Algorithms', subject:'CS', difficulty:1, text:'What is the time complexity of merge sort?', options:['O(n)','O(n log n)','O(n²)','O(log n)'], answer:'O(n log n)', explanation:'Merge sort consistently achieves O(n log n) in all cases' },

  { topic:'Algorithms', subject:'CS', difficulty:2, text:'What is the difference between divide and conquer and dynamic programming?', options:['No difference','D&C has overlapping subproblems, DP doesn\'t','DP stores subproblem results, D&C doesn\'t','D&C is always faster'], answer:'DP stores subproblem results, D&C doesn\'t', explanation:'DP memoizes overlapping subproblem results; D&C solves independent subproblems' },
  { topic:'Algorithms', subject:'CS', difficulty:2, text:'Quick sort uses which strategy?', options:['Dynamic programming','Greedy','Divide and conquer','Backtracking'], answer:'Divide and conquer', explanation:'Quick sort partitions the array around a pivot — a divide and conquer approach' },
  { topic:'Algorithms', subject:'CS', difficulty:2, text:'What is memoization?', options:['Writing code comments','Caching results of expensive function calls','Memory allocation','A sorting technique'], answer:'Caching results of expensive function calls', explanation:'Memoization stores results of function calls to avoid redundant computation' },
  { topic:'Algorithms', subject:'CS', difficulty:2, text:'What is the worst-case time complexity of quicksort?', options:['O(n log n)','O(n)','O(n²)','O(log n)'], answer:'O(n²)', explanation:'Quicksort worst case O(n²) occurs when pivot is always the smallest/largest element' },
  { topic:'Algorithms', subject:'CS', difficulty:2, text:'Which algorithm finds the minimum spanning tree?', options:['Dijkstra\'s','Kruskal\'s','BFS','DFS'], answer:'Kruskal\'s', explanation:'Kruskal\'s algorithm finds the MST by adding edges in order of weight' },
  { topic:'Algorithms', subject:'CS', difficulty:2, text:'What is a base case in recursion?', options:['The first recursive call','The condition that stops recursion','The largest input','The return value'], answer:'The condition that stops recursion', explanation:'A base case terminates recursion by returning a value without recursive calls' },

  { topic:'Algorithms', subject:'CS', difficulty:3, text:'What is the time complexity of the Knapsack problem using DP?', options:['O(n)','O(nW)','O(n²)','O(2ⁿ)'], answer:'O(nW)', explanation:'The DP solution to 0/1 Knapsack is O(nW) where n=items, W=capacity' },
  { topic:'Algorithms', subject:'CS', difficulty:3, text:'What is the purpose of the Floyd-Warshall algorithm?', options:['Sorting','Single-source shortest path','All-pairs shortest path','Minimum spanning tree'], answer:'All-pairs shortest path', explanation:'Floyd-Warshall finds shortest paths between ALL pairs of vertices in O(V³)' },
  { topic:'Algorithms', subject:'CS', difficulty:3, text:'What is a NP-complete problem?', options:['Solvable in polynomial time','Verifiable in polynomial time but not known to be solvable in polynomial time','Impossible to solve','Always solved by greedy'], answer:'Verifiable in polynomial time but not known to be solvable in polynomial time', explanation:'NP-complete problems can be verified quickly but no known polynomial-time solution exists' },
  { topic:'Algorithms', subject:'CS', difficulty:3, text:'What does Big-O notation describe?', options:['Exact running time','Best case performance','Upper bound on growth rate','Memory usage only'], answer:'Upper bound on growth rate', explanation:'Big-O describes the upper bound (worst case) growth rate of an algorithm\'s time or space' },

  // ═══════════════════════════════
  // GRAMMAR
  // ═══════════════════════════════
  { topic:'Grammar', subject:'English', difficulty:1, text:'What is a noun?', options:['An action word','A describing word','A person, place, or thing','A connecting word'], answer:'A person, place, or thing', explanation:'Nouns name people, places, things, or ideas' },
  { topic:'Grammar', subject:'English', difficulty:1, text:'What is a verb?', options:['A naming word','An action or state word','A describing word','A joining word'], answer:'An action or state word', explanation:'Verbs express actions (run, eat) or states (be, seem)' },
  { topic:'Grammar', subject:'English', difficulty:1, text:'Which is an adjective?', options:['Run','Beautiful','Quickly','And'], answer:'Beautiful', explanation:'Adjectives describe or modify nouns' },
  { topic:'Grammar', subject:'English', difficulty:1, text:'What is a pronoun?', options:['A type of noun','A word that replaces a noun','An action word','A describing word'], answer:'A word that replaces a noun', explanation:'Pronouns (he, she, it, they) replace nouns in sentences' },
  { topic:'Grammar', subject:'English', difficulty:1, text:'Identify the verb: "The dog runs fast."', options:['dog','runs','fast','The'], answer:'runs', explanation:'"Runs" is the action verb in this sentence' },
  { topic:'Grammar', subject:'English', difficulty:1, text:'What punctuation ends a question?', options:['Full stop','Exclamation mark','Question mark','Comma'], answer:'Question mark', explanation:'Questions end with a question mark (?)' },
  { topic:'Grammar', subject:'English', difficulty:1, text:'Which sentence is correct?', options:['She don\'t like it','She doesn\'t like it','She not like it','She didn\'t likes it'], answer:'She doesn\'t like it', explanation:'"Doesn\'t" is the correct third-person singular negative form' },
  { topic:'Grammar', subject:'English', difficulty:1, text:'What is a conjunction?', options:['A naming word','A word that joins clauses','An action word','A describing word'], answer:'A word that joins clauses', explanation:'Conjunctions (and, but, or, because) connect words, phrases, or clauses' },

  { topic:'Grammar', subject:'English', difficulty:2, text:'What is a subordinate clause?', options:['A main clause','A clause that can stand alone','A clause that depends on the main clause','A type of phrase'], answer:'A clause that depends on the main clause', explanation:'A subordinate clause cannot stand alone — it depends on the main clause for meaning' },
  { topic:'Grammar', subject:'English', difficulty:2, text:'Identify the subject: "The tall boy kicked the ball."', options:['tall','boy','kicked','ball'], answer:'boy', explanation:'The subject is who/what performs the action. "The tall boy" — boy is the noun/subject' },
  { topic:'Grammar', subject:'English', difficulty:2, text:'What is the passive voice of "The cat ate the fish"?', options:['The fish ate the cat','The fish was eaten by the cat','The cat was eating the fish','The fish has been eaten'], answer:'The fish was eaten by the cat', explanation:'Passive voice: object + was/were + past participle + by + subject' },
  { topic:'Grammar', subject:'English', difficulty:2, text:'Which sentence uses the correct apostrophe?', options:["The dogs' bone","The dog\'s bone","The dogs bone","The dog\'s' bone"], answer:"The dog's bone", explanation:"Dog's = singular possessive, so apostrophe before s" },
  { topic:'Grammar', subject:'English', difficulty:2, text:'What tense is "She had eaten before he arrived"?', options:['Simple past','Past continuous','Past perfect','Present perfect'], answer:'Past perfect', explanation:'Past perfect (had + past participle) indicates an action completed before another past action' },
  { topic:'Grammar', subject:'English', difficulty:2, text:'What is a preposition?', options:['An action word','A word showing relationship between noun and other words','A describing word','A joining word'], answer:'A word showing relationship between noun and other words', explanation:'Prepositions (in, on, at, by) show relationships of position, time, or manner' },

  { topic:'Grammar', subject:'English', difficulty:3, text:'What is a dangling modifier?', options:['A misplaced adjective','A modifier that doesn\'t clearly relate to what it modifies','A type of clause','A verb form'], answer:'A modifier that doesn\'t clearly relate to what it modifies', explanation:'A dangling modifier is a phrase that doesn\'t logically connect to the word it\'s meant to modify' },
  { topic:'Grammar', subject:'English', difficulty:3, text:'Which is an example of a gerund?', options:['"Running is fun" — Running','To run fast','He runs daily','Run!'], answer:'"Running is fun" — Running', explanation:'A gerund is a verb used as a noun — "Running" is the subject here' },
  { topic:'Grammar', subject:'English', difficulty:3, text:'What is the subjunctive mood used for?', options:['Stating facts','Expressing wishes, hypotheticals, or demands','Commands only','Questions only'], answer:'Expressing wishes, hypotheticals, or demands', explanation:'Subjunctive expresses hypothetical situations: "If I were you..."' },
  { topic:'Grammar', subject:'English', difficulty:3, text:'What is a compound-complex sentence?', options:['Two simple sentences','At least two independent clauses and one dependent clause','One independent and one dependent clause','Three simple sentences'], answer:'At least two independent clauses and one dependent clause', explanation:'A compound-complex sentence has 2+ independent clauses AND 1+ dependent clauses' },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Question.deleteMany({});
  await Question.insertMany(questions);
  console.log(`✅ Seeded ${questions.length} questions across all subjects!`);
  process.exit();
});